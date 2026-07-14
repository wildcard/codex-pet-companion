# Codex Pet Companion 0.1.1

This patch release fixes Web Component rendering on sites with a strict `style-src 'self'` Content Security Policy.

- Sprite dimensions, atlas frames, and floating-position variables now update through a constructable shadow stylesheet instead of blocked inline styles.
- Browser verification now fails on CSP console violations and zero-sized sprites.
- The Kavana adoption test now proves the live SDK card has visible dimensions and a loaded atlas on desktop and mobile.

The package continues to include:

- `<codex-pet-companion>` for static HTML and modern frameworks;
- JavaScript control API, React adapter, and lightweight `codex-pet-companion/animator` entrypoint for existing experiences;
- Codex v1/v2 manifest and atlas validation;
- roaming, drag, dialogue, sleep, tuck/recall, persistence, keyboard, touch, and reduced-motion behavior;
- Kavana as the bundled default pet;
- `codex-pet-web` CLI plus hosted agent skill with terminal zoomies;
- npm, unpkg, and jsDelivr entrypoints;
- vanilla, React, strict-CSP, desktop, mobile, package, bundle-size, Kavana-site, and Caro-site verification;
- live field guides at https://pets.caro.sh and https://kavana.caro.sh/#web-sdk.
