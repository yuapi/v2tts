import { romanize } from '@romanize/korean';
import { franc } from 'franc';

/**
 * Discord 메시지에서 불필요한 요소 제거
 */
function cleanDiscordText(text) {
  return text
    .replace(/https?:\/\/\S+/g, '링크')         // URL
    .replace(/<@!?\d+>/g, '')                      // 유저 멘션
    .replace(/<@&\d+>/g, '')                       // 역할 멘션
    .replace(/<#\d+>/g, '')                        // 채널 멘션
    .replace(/<a?:\w+:\d+>/g, '')                 // 커스텀 이모지
    .replace(/```[\s\S]*?```/g, '코드블록')       // 코드블록
    .replace(/`[^`]+`/g, '코드')                   // 인라인 코드
    .trim();
}

/**
 * 언어 감지 → 필요 시 로마자 변환
 * - ko  → @romanize/korean 으로 로마자 변환
 * - ja / en → 그대로 전달
 * - 그 외 → 한글 포함 여부 검사 후 변환 시도, 없으면 그대로
 *
 * franc는 ISO 639-3 코드를 반환합니다. (kor, jpn, eng)
 */
export function preprocessText(text) {
  const cleaned = cleanDiscordText(text);
  if (!cleaned) return '';

  // 한글 포함 여부 빠른 체크
  const hasHangul = /[가-힣]/.test(cleaned);
  // 일본어 포함 여부 빠른 체크 (히라가나·가타카나)
  const hasJapanese = /[\u3040-\u30FF]/.test(cleaned);

  if (hasJapanese && !hasHangul) return cleaned;

  if (hasHangul) {
    // 한글이 섞인 경우 전체를 로마자 변환
    return romanize(cleaned);
  }

  // 그 외: franc로 언어 감지
  const lang = franc(cleaned, { minLength: 3 });

  if (lang === 'jpn' || lang === 'eng') return cleaned;

  // 감지 불확실(und) 또는 기타 → 원문 그대로
  return cleaned;
}
