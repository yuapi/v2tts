import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import cfg from '../config.js';

const DATA_DIR = './data';
const FILE_PATH = `${DATA_DIR}/guild_settings.json`;

/** @type {Map<string, { ttsChannelId: string|null, speakerId: number }>} */
let store = new Map();

function load() {
  mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(FILE_PATH)) return;
  try {
    const raw = JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
    store = new Map(Object.entries(raw));
  } catch (e) {
    console.error('[Settings] 로드 실패:', e.message);
  }
}

function save() {
  try {
    const obj = Object.fromEntries(store);
    writeFileSync(FILE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Settings] 저장 실패:', e.message);
  }
}

export function getSettings(guildId) {
  if (!store.has(guildId)) {
    store.set(guildId, { ttsChannelId: null, speakerId: cfg.defaultSpeakerId, speed: cfg.defaultSpeed });
  }
  return store.get(guildId);
}

export function setTtsChannel(guildId, channelId) {
  const s = getSettings(guildId);
  s.ttsChannelId = channelId;
  save();
}

export function setSpeaker(guildId, speakerId) {
  const s = getSettings(guildId);
  s.speakerId = speakerId;
  save();
}

export function setSpeed(guildId, speed) {
  const s = getSettings(guildId);
  s.speed = speed;
  save();
}

// 모듈 로드 시 즉시 읽기
load();
