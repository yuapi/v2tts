import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { setTtsChannel } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('settts')
    .setDescription('TTS를 실행할 텍스트 채널을 설정합니다. (관리자 전용)')
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('TTS 채널 (미입력 시 현재 채널)')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const target = interaction.options.getChannel('channel') ?? interaction.channel;
    setTtsChannel(interaction.guild.id, target.id);
    await interaction.reply({
      content: `✅ TTS 채널이 ${target.toString()}으로 설정되었습니다.`,
      ephemeral: true,
    });
  },
};
