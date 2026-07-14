# Codex Pet Companion 0.3.1

This release brings the long-running Caro companion route to any site and removes redundant pet loading during custom-element setup.

The 0.3.1 patch ensures a user-requested `startRoaming()` launch overrides `behaviors.roam: false`, which continues to control ambient automatic roaming only.

- Call `await pet.startRoaming()` to move an already-loaded inline pet into a persistent, natural route across the viewport.
- The route uses the same deliberate running, waving, looking, jumping, working, and review cadence as caro.sh.
- Repeated calls are idempotent: one element, one route timer, and no duplicate manifest or atlas requests.
- Parser upgrades and behavior-only config changes are coalesced so the pet loads once.
- `zoomies()` remains available for a short, one-off page animation.

The package continues to include:

- `<codex-pet-companion>` for static HTML and modern frameworks;
- JavaScript control API, React adapter, and lightweight `codex-pet-companion/animator` entrypoint for existing experiences;
- Codex v1/v2 manifest and atlas validation;
- roaming, drag, dialogue, sleep, tuck/recall, persistence, keyboard, touch, and reduced-motion behavior;
- Kavana as the bundled default pet;
- `codex-pet-web` CLI plus hosted agent skill with terminal zoomies;
- npm, unpkg, and jsDelivr entrypoints;
- vanilla, React, strict-CSP, desktop, mobile, package, bundle-size, Kavana-site, and Caro-site verification;
- live field guides at https://codexpet.dev and https://kavana.pet/#web-sdk.
