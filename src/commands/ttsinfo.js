import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSettings, getUserSettings, getEffectiveSettings } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ttsinfo')
    .setDescription('현재 TTS 설정을 확인합니다.'),

  async execute(interaction) {
    const gs = getSettings(interaction.guild.id);
    const us = getUserSettings(interaction.user.id);
    const effective = getEffectiveSettings(interaction.guild.id, interaction.user.id);

    const channelText = gs.ttsChannelId ? `<#${gs.ttsChannelId}>` : '설정되지 않음';

    const embed = new EmbedBuilder()
      .setTitle('📋 TTS 설정 정보')
      .setColor(0x5865F2)
      .addFields(
        { name: '📢 TTS 채널', value: channelText, inline: false },
        { name: '\u200b', value: '**🌐 서버 기본값**', inline: false },
        { name: '화자 ID', value: String(gs.speakerId), inline: true },
        { name: '말하기 속도', value: String(gs.speed), inline: true },
        { name: '\u200b', value: '**👤 내 설정**', inline: false },
        { name: '화자 ID', value: us.speakerId !== null ? String(us.speakerId) : '서버 기본값 사용', inline: true },
        { name: '말하기 속도', value: us.speed !== null ? String(us.speed) : '서버 기본값 사용', inline: true },
        { name: '\u200b', value: '**✅ 실제 적용값**', inline: false },
        { name: '화자 ID', value: String(effective.speakerId), inline: true },
        { name: '말하기 속도', value: String(effective.speed), inline: true },
      )
      .setFooter({ text: `서버: ${interaction.guild.name}` });

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
