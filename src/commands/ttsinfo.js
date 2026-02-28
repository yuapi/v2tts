import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSettings } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ttsinfo')
    .setDescription('현재 서버의 TTS 설정을 확인합니다.'),

  async execute(interaction) {
    const gs = getSettings(interaction.guild.id);
    const channelText = gs.ttsChannelId
      ? `<#${gs.ttsChannelId}>`
      : '설정되지 않음';

    const embed = new EmbedBuilder()
      .setTitle('📋 TTS 설정 정보')
      .setColor(0x5865F2)
      .addFields(
        { name: 'TTS 채널', value: channelText, inline: true },
        { name: '화자 ID', value: String(gs.speakerId), inline: true },
        { name: '말하기 속도', value: String(gs.speed ?? 0.8), inline: true },
      )
      .setFooter({ text: `서버: ${interaction.guild.name}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
