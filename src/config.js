import { config } from 'dotenv';
config();

const REQUIRED_VARS = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID'];
for (const key of REQUIRED_VARS) {
  if (!process.env[key]) {
    throw new Error(`필수 환경변수 누락: ${key} (.env 파일을 확인하세요)`);
  }
}

export default {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  voicevoxBaseUrl: process.env.VOICEVOX_BASE_URL ?? 'http://127.0.0.1:50021',
  defaultSpeakerId: parseInt(process.env.DEFAULT_SPEAKER_ID ?? '3', 10),
  defaultSpeed: parseFloat(process.env.DEFAULT_SPEED ?? '0.8'),
};
