# Static HTML and CDN

Use a pinned version in production:

```html
<script src="https://unpkg.com/codex-pet-companion@0.2.0/dist/codex-pet-companion.global.js"
  integrity="sha384-SgmWdXBrWbTzInIB9a/nFYUPqB8DzfB+WDQl5wneLvUHw/L7BWcWSwwp2UZ6/UKV"
  crossorigin="anonymous"></script>
<codex-pet-companion></codex-pet-companion>
```

This quick-start loads Kavana's default files from the pinned CDN package. To self-host or use another pet:

```html
<codex-pet-companion
  manifest-url="/codex-pets/my-pet/pet.json"
  atlas-url="/codex-pets/my-pet/spritesheet.webp"
></codex-pet-companion>
```

For strict CSP, run `npx codex-pet-companion init .`, self-host the JavaScript bundle and generated pet files, and use the local `manifest-url` and `atlas-url` paths. The bare element requires unpkg in `connect-src` and `img-src`.
