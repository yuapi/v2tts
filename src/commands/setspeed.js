import { SlashCommandBuilder } from 'discord.js';
import { setUserSpeed } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setspeed')
    .setDescription('내 TTS 말하기 속도를 변경합니다.')
    .addNumberOption(opt =>
      opt.setName('speed')
        .setDescription('속도 배율 (0.5 ~ 2.0, 기본 0.8)')
        .setRequired(true)
        .setMinValue(0.5)
        .setMaxValue(2.0)
    ),

  async execute(interaction) {
    const speed = interaction.options.getNumber('speed');
    setUserSpeed(interaction.user.id, speed);
    await interaction.reply({ content: `✅ 내 말하기 속도가 **${speed}**로 설정되었습니다.`, flags: 64 });
  },
};
