# byeorim.com

ByeoRim · 벼림의 앱·게임 퍼블리셔 소개 페이지. 확정된 벽돌색 심볼과 브랜드 소개, 작품 준비 현황, 공식 SNS 링크를 담는다. Cloudflare Workers 정적 자산으로 서빙하며 한국어(`/`)와 영어(`/en/`)를 지원하며, 별도 빌드 단계나 외부 폰트·스크립트가 없다.

## 구조

```
public/index.html   한국어 랜딩페이지 (빌드 단계 없음)
public/en/index.html  영어 랜딩페이지
public/styles.css   두 언어가 공유하는 스타일
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

사이트의 제목·소개 문구·공식 SNS 주소는 `public/index.html`과 `public/en/index.html`에서 함께 수정한다. 공개 작품이 생기면 두 페이지의 `#works` 준비 중 안내를 작품 소개로 교체한다. 공통 디자인은 `public/styles.css`에서 수정한다.

상단의 English / 한국어 링크로 언어를 전환한다. 각 언어는 독립된 정적 페이지로 제공되어 JavaScript 없이 동작하며, 언어별 canonical·hreflang·Open Graph 메타데이터를 포함한다.
