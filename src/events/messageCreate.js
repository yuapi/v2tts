import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
} from '@discordjs/voice';
import { preprocessText } from '../utils/textProcessor.js';
import { synthesizeSpeech } from '../utils/voicevox.js';
import { getSettings } from '../utils/settingsManager.js';
import { enqueue } from '../utils/ttsQueue.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    // 봇 메시지, DM 무시
    if (message.author.bot || !message.guild) return;

    const gs = getSettings(message.guild.id);
    if (!gs.ttsChannelId || message.channel.id !== gs.ttsChannelId) return;

    const text = preprocessText(message.content);
    if (!text) return;

    let connection = getVoiceConnection(message.guild.id);

    // 봇이 음성 채널에 없을 때 → 메시지 발신자 채널로 자동 입장
    if (!connection) {
      const voiceChannel = message.member?.voice?.channel;
      if (!voiceChannel) {
        await message.reply({
          content: '❌ 음성 채널에 먼저 입장해 주세요!',
          allowedMentions: { repliedUser: false },
        }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        return;
      }

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: true,
      });

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
      } catch {
        connection.destroy();
        await message.reply({ content: '❌ 음성 채널 연결에 실패했습니다.' });
        return;
      }
    }

    try {
      const speed = gs.speed ?? 1.0;
      const wavBuffer = await synthesizeSpeech(text, gs.speakerId, speed);
      enqueue(message.guild.id, connection, wavBuffer);
    } catch (err) {
      console.error('[TTS] 합성 실패:', err.message);
    }
  },
};
