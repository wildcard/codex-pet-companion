# Deploying the SDK field guide

The npm package and the demonstration website are independent release surfaces:

- npm, unpkg, and jsDelivr distribute the reusable SDK;
- Cloudflare serves the interactive field guide at `codexpet.dev`; `pets.caro.sh` remains a compatibility route.

The field guide uses only files produced by `pnpm build:docs`. It does not require a Worker handler, database, runtime secret, analytics service, or private API.

## Deploy

Authenticate Wrangler to the intended Cloudflare account, then run:

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm deploy
```

`pnpm deploy` rebuilds `site/` and deploys it with `wrangler.jsonc`. The primary custom domain is `codexpet.dev`, with `pets.caro.sh` retained as a compatibility route.

## Verify production

```bash
curl --fail --silent --show-error https://codexpet.dev/ > /dev/null
pnpm test:live
```

The live suite runs desktop and mobile Chromium against production and covers transparent Kavana rendering, self-origin-only asset loading, tuck/recall focus behavior, and v1/v2 compatibility behavior.

For a domain change, update the custom-domain route in `wrangler.jsonc`, confirm the zone is already managed by the authenticated Cloudflare account, deploy, and rerun `pnpm test:live` with `PLAYWRIGHT_BASE_URL` set to the new origin before removing the old route.
