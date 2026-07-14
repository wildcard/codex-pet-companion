# Changelog

## 0.3.0

- Add idempotent `startRoaming()` for persistent page roaming using the slower, natural Caro route.
- Coalesce custom-element initialization so parser upgrades and behavior-only config changes do not refetch pet assets.
- Keep inline pets visible while they transition into roaming and emit `codex-pet-roam-start` after activation.

## 0.2.0

- Add the public `zoomies()` Web Component action, including an inline-to-page roaming sequence and a reduced-motion wave fallback.
- Add live zoomies controls to the SDK and Kavana field guides.
- Distinguish the CDN quick-start from strict-CSP self-hosting and document the exact `manifest-url` / `atlas-url` attributes.
- Add pinned Subresource Integrity and `crossorigin="anonymous"` to CDN embed examples.

## 0.1.1

- Render Web Component sprites and floating-position variables through a constructable shadow stylesheet so strict `style-src 'self'` policies no longer collapse the pet to zero width.
- Strengthen browser and Kavana adoption tests to assert visible sprite dimensions, atlas rendering, and zero CSP violations.

## 0.1.0

- Initial Web Component, JavaScript API, React adapter, lightweight animator entrypoint, CLI, hosted skill, Kavana default asset, browser tests, and npm/CDN distribution.
- Verified static HTML, React, strict-CSP, Kavana website, and Caro website adoption on desktop and mobile.
