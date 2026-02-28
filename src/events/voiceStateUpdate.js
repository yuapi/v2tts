import { getVoiceConnection } from '@discordjs/voice';
import { clearQueue } from '../utils/ttsQueue.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    if (oldState.member?.user.bot) return;

    const guild = oldState.guild;
    const connection = getVoiceConnection(guild.id);
    if (!connection) return;

    // 봇이 있는 채널 확인
    const botChannel = guild.members.me?.voice?.channel;
    if (!botChannel) return;

    // 봇 채널에서 나간 경우에만 체크
    if (oldState.channelId !== botChannel.id) return;

    const humans = botChannel.members.filter(m => !m.user.bot);
    if (humans.size === 0) {
      clearQueue(guild.id);
      connection.destroy();
      console.log(`[Voice] [${guild.name}] 채널이 비어 봇이 퇴장했습니다.`);
    }
  },
};
