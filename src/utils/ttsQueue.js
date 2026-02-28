import {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
} from '@discordjs/voice';
import { Readable } from 'stream';

/** 서버별 재생 큐 관리 */
const queues = new Map(); // guildId → { player, queue: [], playing: boolean }

function getGuildQueue(guildId) {
  if (!queues.has(guildId)) {
    const player = createAudioPlayer();
    queues.set(guildId, { player, queue: [], playing: false });
  }
  return queues.get(guildId);
}

/**
 * WAV Buffer를 서버 큐에 추가하고 재생을 시작합니다.
 * @param {string} guildId
 * @param {import('@discordjs/voice').VoiceConnection} connection
 * @param {Buffer} wavBuffer
 */
export function enqueue(guildId, connection, wavBuffer) {
  const gq = getGuildQueue(guildId);
  gq.queue.push(wavBuffer);
  connection.subscribe(gq.player);

  if (!gq.playing) {
    processQueue(guildId);
  }
}

function processQueue(guildId) {
  const gq = queues.get(guildId);
  if (!gq || gq.queue.length === 0) {
    if (gq) gq.playing = false;
    return;
  }

  gq.playing = true;
  const wavBuffer = gq.queue.shift();
  const stream = Readable.from(wavBuffer);
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  gq.player.play(resource);

  gq.player.once(AudioPlayerStatus.Idle, () => {
    processQueue(guildId);
  });

  gq.player.once('error', (err) => {
    console.error(`[TTS Queue] 재생 오류 (guild: ${guildId}):`, err.message);
    processQueue(guildId);
  });
}

/** 서버 큐 초기화 (봇 퇴장 시) */
export function clearQueue(guildId) {
  const gq = queues.get(guildId);
  if (gq) {
    gq.player.stop(true);
    gq.queue = [];
    gq.playing = false;
  }
  queues.delete(guildId);
}
