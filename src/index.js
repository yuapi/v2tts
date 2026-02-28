import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import cfg from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// 슬래시 커맨드 등록
client.commands = new Collection();
const commandsPath = join(__dirname, 'commands');
for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const { default: cmd } = await import(pathToFileURL(join(commandsPath, file)).href);
  client.commands.set(cmd.data.name, cmd);
}

// 이벤트 등록
const eventsPath = join(__dirname, 'events');
for (const file of readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const { default: event } = await import(pathToFileURL(join(eventsPath, file)).href);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(cfg.token);
