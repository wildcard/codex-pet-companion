# Static HTML and CDN

Use a pinned version in production:

```html
<script src="https://unpkg.com/codex-pet-companion@0.3.0/dist/codex-pet-companion.global.js"
  integrity="sha384-KXVtGeBD2DiUJSgywbbRB9zA4ZxLkVlDsooJujID7XO9Ji2/u9s/LQJn8qJ3oBdp"
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
