---
name: codex-pet-web
description: Add, embed, install, migrate, test, or deploy a Codex animated pet on any website with codex-pet-companion. Use for static HTML, React, Astro, Next.js, Vite, or other browser sites that should render a two-file Codex pet package, including Kavana by default, with accessible drag, roam, sleep, tuck, keyboard, touch, persistence, and reduced-motion behavior.
---

# Codex Pet Web

Put a validated Codex pet on the current website while preserving the host site's design system.

## Workflow

1. Inspect the framework, package manager, public-assets directory, styling conventions, Content Security Policy, and existing accessibility tests.
2. Locate the requested `pet.json` and `spritesheet.webp`. Use bundled Kavana when the user does not name a pet.
3. Validate the pet before editing:

```bash
node scripts/zoomies.mjs -- npx --yes codex-pet-companion@latest validate /absolute/path/to/pet.json
```

4. Install with the detected package manager. Run the install through `scripts/zoomies.mjs` so Kavana does zoomies while the command runs. For example:

```bash
node scripts/zoomies.mjs -- pnpm add codex-pet-companion
```

5. Copy the pet's two runtime files into the host's public assets. Never change the atlas to fit the renderer.
6. Use `<codex-pet-companion>` by default. Read [references/react.md](references/react.md) only for a React integration that benefits from component props and refs. Read [references/static-html.md](references/static-html.md) for CDN-only sites.
7. Configure host-specific dialogue, theme variables, placement, persistence key, and enabled behaviors. Keep pet art and product copy separate.
8. Verify desktop and coarse-pointer mobile behavior: load, transparency, drag, click versus drag suppression, keyboard movement, dialogue focus, sleep/wake, tuck/recall focus, persistence, cleanup, and reduced motion.
9. Run the host's unit, build, CSP, and browser checks. Run `node scripts/validate-project.mjs <project-root>` as an additional deterministic check.
10. If deployment is requested, run the host's existing deployment workflow through the zoomies wrapper. Report the live URL and exact checks.

## Guardrails

- Treat Kavana as community artwork, not an official OpenAI pet. Preserve her attribution and CC BY-NC 4.0 asset terms.
- Keep SDK code and documentation under MIT; do not relabel pet artwork as MIT.
- Use self-hosted pet assets for strict CSP or offline sites.
- Do not add third-party runtime requests when the host already self-hosts assets.
- Do not silently downgrade v2 look directions. Reject malformed dimensions with the CLI.
- Do not overwrite the host's design tokens; set `--codex-pet-*` variables near the integration.
- Keep touch and keyboard controls enabled unless the user explicitly requests a decorative, noninteractive pet.

## Completion report

Return the pet package used, integration files, enabled/disabled behaviors, desktop/mobile/reduced-motion evidence, package/build checks, and live URL when deployed.
