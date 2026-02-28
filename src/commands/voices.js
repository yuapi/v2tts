import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSpeakers } from '../utils/voicevox.js';

export default {
  data: new SlashCommandBuilder()
    .setName('voices')
    .setDescription('사용 가능한 VOICEVOX 화자 목록을 표시합니다.'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let speakers;
    try {
      speakers = await getSpeakers();
    } catch {
      await interaction.editReply('❌ VOICEVOX 서버에 연결할 수 없습니다.');
      return;
    }

    // Discord Embed 필드 제한: 필드당 1024자, 총 25개 필드
    const embeds = [];
    let fields = [];
    let fieldCount = 0;

    for (const sp of speakers) {
      const talkStyles = sp.styles.filter(s => s.type === 'talk');
      if (!talkStyles.length) continue;

      const value = talkStyles.map(s => `\`${String(s.id).padStart(3, ' ')}\` ${s.name}`).join('\n');
      fields.push({ name: sp.name, value, inline: true });
      fieldCount++;

      // Embed 당 최대 25필드
      if (fieldCount === 24) {
        embeds.push(
          new EmbedBuilder()
            .setTitle('🔊 VOICEVOX 화자 목록')
            .setColor(0x5865F2)
            .addFields(fields)
        );
        fields = [];
        fieldCount = 0;
      }
    }

    if (fields.length) {
      embeds.push(
        new EmbedBuilder()
          .setTitle(embeds.length === 0 ? '🔊 VOICEVOX 화자 목록' : '🔊 화자 목록 (계속)')
          .setColor(0x5865F2)
          .addFields(fields)
          .setFooter({ text: '/setvoice <ID> 로 화자를 변경하세요.' })
      );
    }

    if (!embeds.length) {
      await interaction.editReply('화자 목록을 가져올 수 없습니다.');
      return;
    }

    await interaction.editReply({ embeds: [embeds[0]] });
    for (let i = 1; i < embeds.length; i++) {
      await interaction.followUp({ embeds: [embeds[i]], ephemeral: true });
    }
  },
};
