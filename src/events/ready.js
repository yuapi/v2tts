import { ActivityType } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[Bot] 로그인 완료: ${client.user.tag}`);
    client.user.setActivity('/settts | TTS 봇', { type: ActivityType.Listening });
  },
};
