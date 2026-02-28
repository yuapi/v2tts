import { SlashCommandBuilder } from 'discord.js';
import { setSpeed } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setspeed')
    .setDescription('TTS 말하기 속도를 조절합니다. (기본값: 0.8)')
    .addNumberOption(opt =>
      opt.setName('speed')
        .setDescription('속도 배율 (0.5 = 느리게 ~ 2.0 = 빠르게, 기본 0.8)')
        .setRequired(true)
        .setMinValue(0.5)
        .setMaxValue(2.0)
    ),

  async execute(interaction) {
    const speed = interaction.options.getNumber('speed');
    setSpeed(interaction.guild.id, speed);
    await interaction.reply({
      content: `✅ 말하기 속도가 **${speed}**로 설정되었습니다.`,
      flags: 64,
    });
  },
};
