import fetch from 'node-fetch';
import cfg from '../config.js';

const BASE = cfg.voicevoxBaseUrl;

/** 화자 목록 조회 */
export async function getSpeakers() {
  const res = await fetch(`${BASE}/speakers`);
  if (!res.ok) throw new Error(`VOICEVOX /speakers 오류: ${res.status}`);
  return res.json();
}

/** audio_query 생성 */
async function audioQuery(text, speakerId) {
  const url = new URL(`${BASE}/audio_query`);
  url.searchParams.set('text', text);
  url.searchParams.set('speaker', speakerId);
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`VOICEVOX /audio_query 오류: ${res.status}`);
  return res.json();
}

/** WAV 바이트 합성 */
async function synthesis(query, speakerId) {
  const url = new URL(`${BASE}/synthesis`);
  url.searchParams.set('speaker', speakerId);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!res.ok) throw new Error(`VOICEVOX /synthesis 오류: ${res.status}`);
  return res.buffer(); // Buffer 반환
}

/**
 * 텍스트 → WAV Buffer 원스탑 파이프라인
 * @param {string} text
 * @param {number} speakerId
 * @returns {Promise<Buffer>}
 */
export async function synthesizeSpeech(text, speakerId, speed=0.8) {
  const query = await audioQuery(text, speakerId);
  query.speedScale = speed;
  return synthesis(query, speakerId);
}

/** 주어진 speakerId가 유효한지 확인 */
export async function isValidSpeakerId(id) {
  try {
    const speakers = await getSpeakers();
    return speakers.some(sp =>
      sp.styles.some(s => s.id === id && s.type === 'talk')
    );
  } catch {
    return false;
  }
}
