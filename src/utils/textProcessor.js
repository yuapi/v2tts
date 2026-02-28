import HangulToKanaModule from 'hangul-to-kana';
const HangulToKana = HangulToKanaModule.default ?? HangulToKanaModule;
import { franc } from 'franc';

function cleanDiscordText(text) {
  return text
    .replace(/https?:\/\/\S+/g, 'リンク')
    .replace(/<@!?\d+>/g, '')
    .replace(/<@&\d+>/g, '')
    .replace(/<#\d+>/g, '')
    .replace(/<a?:\w+:\d+>/g, '')
    .replace(/```[\s\S]*?```/g, 'コードブロック')
    .replace(/`[^`]+`/g, 'コード')
    .trim();
}

export function preprocessText(text) {
  const cleaned = cleanDiscordText(text);
  if (!cleaned) return '';

  const hasHangul = /[가-힣]/.test(cleaned);
  const hasJapanese = /[\u3040-\u30FF]/.test(cleaned);

  if (hasJapanese && !hasHangul) return cleaned;

  if (hasHangul) {
    // 한글 → 가타카나 변환
    return HangulToKana.convert(cleaned).toString();
  }

  const lang = franc(cleaned, { minLength: 3 });
  if (lang === 'jpn' || lang === 'eng') return cleaned;

  return cleaned;
}
