# byeorim.com

byeorim organization 랜딩페이지. Cloudflare Workers 정적 자산으로 서빙한다.

## 구조

```
public/index.html   랜딩페이지 (빌드 단계 없음)
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
