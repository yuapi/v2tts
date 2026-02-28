# V2TTS (discord.js v14)

VOICEVOX 엔진을 활용한 Discord TTS 봇입니다.  
슬래시 커맨드 기반으로 동작하며, 한국어는 자동으로 로마자 변환 후 읽어줍니다.

## 요구 사항

- Node.js 24+
- [VOICEVOX](https://voicevox.hiroshiba.jp/) 엔진 실행 중 (기본 포트 `50021`)
- FFmpeg 설치 및 PATH 등록

## 설치

```bash
git clone https://github.com/YOUR_REPO/discord-tts-bot.git
cd discord-tts-bot
npm install
cp .env.example .env
# .env 파일을 열어 토큰 등을 입력
```

## 환경변수 (.env)

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `DISCORD_BOT_TOKEN` | Discord 봇 토큰 **(필수)** | - |
| `DISCORD_CLIENT_ID` | 애플리케이션 Client ID **(필수)** | - |
| `VOICEVOX_BASE_URL` | VOICEVOX 서버 주소 | `http://127.0.0.1:50021` |
| `DEFAULT_SPEAKER_ID` | 기본 화자 ID | `3` (ずんだもん ノーマル) |

> `DISCORD_CLIENT_ID`는 Discord Developer Portal → 앱 선택 → General Information의 **Application ID**입니다.

## 실행 순서

```bash
# 1. 슬래시 커맨드 Discord에 등록 (최초 1회 + 커맨드 변경 시)
npm run deploy

# 2. 봇 실행
npm start
```

## 슬래시 커맨드

| 커맨드 | 설명 | 권한 |
|--------|------|------|
| `/settts [channel]` | TTS 채널 설정 (기본: 현재 채널) | 채널 관리 |
| `/unsettts` | TTS 채널 해제 | 채널 관리 |
| `/setvoice <speaker_id>` | 화자 변경 | 모두 |
| `/voices` | 화자 목록 확인 | 모두 |
| `/ttsinfo` | 현재 TTS 설정 확인 | 모두 |
| `/join` | 봇 음성 채널 수동 입장 | 모두 |
| `/leave` | 봇 음성 채널 퇴장 | 모두 |

## 프로젝트 구조

```
discord-tts-bot/
├── src/
│   ├── index.js               # 봇 진입점
│   ├── config.js              # 환경변수 관리
│   ├── deploy-commands.js     # 슬래시 커맨드 등록 스크립트
│   ├── commands/              # 슬래시 커맨드
│   │   ├── settts.js
│   │   ├── unsettts.js
│   │   ├── setvoice.js
│   │   ├── voices.js
│   │   ├── ttsinfo.js
│   │   ├── join.js
│   │   └── leave.js
│   ├── events/                # Discord 이벤트 핸들러
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   ├── messageCreate.js   # TTS 핵심 로직
│   │   └── voiceStateUpdate.js
│   └── utils/
│       ├── voicevox.js        # VOICEVOX API 클라이언트
│       ├── textProcessor.js   # 언어 감지 + 로마자 변환
│       ├── settingsManager.js # 서버별 설정 (JSON 영속성)
│       └── ttsQueue.js        # 재생 큐 관리
├── data/                      # 서버 설정 저장소 (.gitignore)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
