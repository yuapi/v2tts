import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
} from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('봇을 현재 음성 채널에 입장시킵니다.'),

  async execute(interaction) {
    const voiceChannel = interaction.member?.voice?.channel;
    if (!voiceChannel) {
      await interaction.reply({ content: '❌ 먼저 음성 채널에 입장해 주세요.', ephemeral: true });
      return;
    }

    const existing = getVoiceConnection(interaction.guild.id);
    if (existing) existing.destroy();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
      await interaction.reply({ content: `✅ **${voiceChannel.name}** 채널에 입장했습니다.`, ephemeral: true });
    } catch {
      connection.destroy();
      await interaction.reply({ content: '❌ 음성 채널 연결에 실패했습니다.', ephemeral: true });
    }
  },
};
