# Static HTML and CDN

Use a pinned version in production:

```html
<script src="https://unpkg.com/codex-pet-companion@0.1.0/dist/codex-pet-companion.global.js"></script>
<codex-pet-companion></codex-pet-companion>
```

The default package-relative asset is Kavana. To self-host or use another pet:

```html
<codex-pet-companion
  manifest-url="/pets/my-pet/pet.json"
  atlas-url="/pets/my-pet/spritesheet.webp"
></codex-pet-companion>
```

For strict CSP, self-host both the JavaScript bundle and pet files and allow only `'self'` for scripts and images.
