# cafe-carte-api

Cafe Carte 팬사이트의 백엔드 API입니다. NestJS로 만들었습니다.

## 시작하기

Node.js 24가 필요합니다.

```bash
npm install
cp .env.example .env
npm run dev
```

## 환경 변수

| 이름              | 설명                      |
| ----------------- | ------------------------- |
| `PORT`            | 서버 포트                 |
| `FRONTEND_URL`    | CORS를 허용할 프론트 주소 |
| `YOUTUBE_API_KEY` | YouTube Data API 키       |

## 스크립트

| 명령             | 설명                   |
| ---------------- | ---------------------- |
| `npm run dev`    | 개발 서버 (watch 모드) |
| `npm run build`  | 빌드                   |
| `npm run prod`   | 빌드 결과 실행         |
| `npm run lint`   | oxlint 검사            |
| `npm run format` | prettier 포맷          |

## API

| 경로                   | 설명                   |
| ---------------------- | ---------------------- |
| `GET /live/:channelId` | 라이브 상태 조회       |
| `GET /covers`          | 커버곡, 노래 쇼츠 목록 |

## API 문서

서버를 실행한 뒤 `/docs`에서 Swagger 문서를 볼 수 있습니다.

## 배포

`main`에 push하면 GitHub Actions가 lint와 build를 확인한 뒤, Docker 이미지를 GHCR에 올리고 서버에 blue-green 방식으로 배포합니다. 자세한 내용은 [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)을 참고하세요.
