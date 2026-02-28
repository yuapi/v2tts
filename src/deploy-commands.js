/**
 * 슬래시 커맨드를 Discord API에 등록합니다.
 * 커맨드를 추가·수정할 때마다 `npm run deploy`를 실행하세요.
 */
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cfg from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const commandsPath = join(__dirname, 'commands');
const commandData = [];

for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const { default: cmd } = await import(join(commandsPath, file));
  commandData.push(cmd.data.toJSON());
}

const rest = new REST().setToken(cfg.token);

try {
  console.log(`[Deploy] ${commandData.length}개의 슬래시 커맨드를 등록 중...`);
  await rest.put(
    Routes.applicationCommands(cfg.clientId),
    { body: commandData },
  );
  console.log('[Deploy] 완료!');
} catch (err) {
  console.error('[Deploy] 오류:', err);
}
