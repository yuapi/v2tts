import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setTtsChannel } from '../utils/settingsManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unsettts')
    .setDescription('TTS 채널 설정을 해제합니다. (관리자 전용)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    setTtsChannel(interaction.guild.id, null);
    await interaction.reply({ content: '✅ TTS 채널 설정이 해제되었습니다.', ephemeral: true });
  },
};
