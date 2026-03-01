import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import cfg from '../config.js';

const DATA_DIR = './data';
const GUILD_FILE = `${DATA_DIR}/guild_settings.json`;
const USER_FILE = `${DATA_DIR}/user_settings.json`;

let guildStore = new Map();
let userStore = new Map();

function load() {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(GUILD_FILE)) {
    try {
      guildStore = new Map(Object.entries(JSON.parse(readFileSync(GUILD_FILE, 'utf-8'))));
    } catch (e) { console.error('[Settings] guild 로드 실패:', e.message); }
  }
  if (existsSync(USER_FILE)) {
    try {
      userStore = new Map(Object.entries(JSON.parse(readFileSync(USER_FILE, 'utf-8'))));
    } catch (e) { console.error('[Settings] user 로드 실패:', e.message); }
  }
}

function saveGuild() {
  try {
    writeFileSync(GUILD_FILE, JSON.stringify(Object.fromEntries(guildStore), null, 2), 'utf-8');
  } catch (e) { console.error('[Settings] guild 저장 실패:', e.message); }
}

function saveUser() {
  try {
    writeFileSync(USER_FILE, JSON.stringify(Object.fromEntries(userStore), null, 2), 'utf-8');
  } catch (e) { console.error('[Settings] user 저장 실패:', e.message); }
}

// ── 서버 설정 ──────────────────────────────────────
export function getSettings(guildId) {
  if (!guildStore.has(guildId)) {
    guildStore.set(guildId, {
      ttsChannelId: null,
      speakerId: cfg.defaultSpeakerId,
      speed: cfg.defaultSpeed,
    });
  }
  return guildStore.get(guildId);
}

export function setTtsChannel(guildId, channelId) {
  const s = getSettings(guildId);
  s.ttsChannelId = channelId;
  saveGuild();
}

export function setSpeaker(guildId, speakerId) {
  const s = getSettings(guildId);
  s.speakerId = speakerId;
  saveGuild();
}

export function setSpeed(guildId, speed) {
  const s = getSettings(guildId);
  s.speed = speed;
  saveGuild();
}

// ── 유저 설정 ──────────────────────────────────────
export function getUserSettings(userId) {
  if (!userStore.has(userId)) {
    userStore.set(userId, { speakerId: null, speed: null });
  }
  return userStore.get(userId);
}

export function setUserSpeaker(userId, speakerId) {
  const s = getUserSettings(userId);
  s.speakerId = speakerId;
  saveUser();
}

export function setUserSpeed(userId, speed) {
  const s = getUserSettings(userId);
  s.speed = speed;
  saveUser();
}

export function resetUserSettings(userId) {
  userStore.set(userId, { speakerId: null, speed: null });
  saveUser();
}

/**
 * 실제 TTS에 사용할 값 반환 (개인 설정 > 서버 기본값)
 */
export function getEffectiveSettings(guildId, userId) {
  const guild = getSettings(guildId);
  const user = getUserSettings(userId);
  return {
    speakerId: user.speakerId ?? guild.speakerId,
    speed: user.speed ?? guild.speed,
  };
}

load();
