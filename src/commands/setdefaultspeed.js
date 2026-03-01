import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setSpeed } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setdefaultspeed')
    .setDescription('서버 기본 TTS 말하기 속도를 변경합니다. (관리자 전용)')
    .addNumberOption(opt =>
      opt.setName('speed')
        .setDescription('속도 배율 (0.5 ~ 2.0, 기본 0.8)')
        .setRequired(true)
        .setMinValue(0.5)
        .setMaxValue(2.0)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const speed = interaction.options.getNumber('speed');
    setSpeed(interaction.guild.id, speed);
    await interaction.reply({ content: `✅ 서버 기본 속도가 **${speed}**로 설정되었습니다.`, flags: 64 });
  },
};
