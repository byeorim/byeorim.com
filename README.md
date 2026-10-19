# byeorim.com

ByeoRim · 벼림의 앱·게임 퍼블리셔 소개 페이지. 확정된 벽돌색 심볼과 브랜드 소개, 작품 준비 현황, 공식 SNS 링크를 담는다. Cloudflare Workers 정적 자산으로 서빙하며 별도 빌드 단계나 외부 폰트·스크립트가 없다.

## 구조

```
public/index.html   랜딩페이지 (빌드 단계 없음)
public/assets/      브랜드 심볼과 SNS 공유 이미지
public/favicon.svg  파비콘
brand/byeorim/      브랜드 원본과 프로필·파비콘 생성 스크립트
scripts/prepare-brand.cjs  브랜드 원본을 사이트에 반영하고 공유 이미지 생성
wrangler.jsonc      Workers 설정 — main 없이 assets만
```

## 로컬 실행

```sh
npx wrangler dev
```

## 배포

```sh
npx wrangler deploy
```

## 브랜드 에셋 갱신

Node.js와 `sharp`를 준비한 뒤 다음을 실행한다. 별도 위치의 sharp를 사용할 때는 `SHARP_MODULE` 환경 변수로 패키지 경로를 지정할 수 있다.

```sh
node brand/byeorim/build.mjs
node scripts/prepare-brand.cjs
```

사이트의 제목·소개 문구·공식 SNS 주소는 `public/index.html`에서 수정한다. 공개 작품이 생기면 `#works`의 준비 중 안내를 작품 소개로 교체한다.
