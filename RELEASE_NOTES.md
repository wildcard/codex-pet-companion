# Codex Pet Companion 0.2.0

This release lets any live pet do page-wide zoomies and makes CDN versus self-hosted security guidance explicit.

- Call `await pet.zoomies()` to send an inline or floating companion roaming across the viewport.
- Reduced-motion users receive a wave without page movement.
- SDK and Kavana field guides include accessible zoomies controls.
- CDN snippets are pinned with SRI; strict-CSP self-hosting examples show `manifest-url` and `atlas-url` explicitly.

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
