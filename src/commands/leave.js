import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { clearQueue } from '../utils/ttsQueue.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('봇을 음성 채널에서 퇴장시킵니다.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      await interaction.reply({ content: '❌ 봇이 음성 채널에 있지 않습니다.', ephemeral: true });
      return;
    }
    clearQueue(interaction.guild.id);
    connection.destroy();
    await interaction.reply({ content: '👋 음성 채널에서 퇴장했습니다.', ephemeral: true });
  },
};
