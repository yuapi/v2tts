import { SlashCommandBuilder } from 'discord.js';
import { setSpeaker } from '../utils/settingsManager.js';
import { isValidSpeakerId } from '../utils/voicevox.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setvoice')
    .setDescription('VOICEVOX 화자를 변경합니다.')
    .addIntegerOption(opt =>
      opt.setName('speaker_id')
        .setDescription('화자 ID (숫자) — /voices 명령어로 목록 확인')
        .setRequired(true)
        .setMinValue(0)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getInteger('speaker_id');
    const valid = await isValidSpeakerId(id);

    if (!valid) {
      await interaction.editReply('❌ 유효하지 않은 화자 ID입니다. `/voices`로 목록을 확인하세요.');
      return;
    }

    setSpeaker(interaction.guild.id, id);
    await interaction.editReply(`✅ 화자 ID가 **${id}**로 변경되었습니다.`);
  },
};
