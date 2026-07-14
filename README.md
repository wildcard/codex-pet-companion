# Codex Pet Web SDK

Put any valid Codex pet on any website with one Web Component. Kavana, the black-and-tan Shiba Inu from Project Caro, is included as the default.

Try the live field guide at [pets.caro.sh](https://pets.caro.sh) and Kavana's real downstream integration at [kavana.caro.sh](https://kavana.caro.sh/#web-sdk).

This is a community project. It is not affiliated with or endorsed by OpenAI. Codex is an OpenAI product.

## One-line CDN embed

```html
<script src="https://unpkg.com/codex-pet-companion@0.1.1/dist/codex-pet-companion.global.js"></script>
<codex-pet-companion></codex-pet-companion>
```

The script defines `<codex-pet-companion>` and resolves Kavana from the same pinned npm package. Pin the version in production.

The equivalent jsDelivr URL is `https://cdn.jsdelivr.net/npm/codex-pet-companion@0.1.1/dist/codex-pet-companion.global.js`.

## npm

```bash
npm install codex-pet-companion
```

```html
<script type="module">
  import 'codex-pet-companion';
</script>

<codex-pet-companion></codex-pet-companion>
```

Use any Codex pet by serving its normal two-file package:

```html
<codex-pet-companion
  manifest-url="/pets/my-pet/pet.json"
  atlas-url="/pets/my-pet/spritesheet.webp"
></codex-pet-companion>
```

Valid v1 atlases are 1536×1872. Valid v2 atlases are 1536×2288 and add sixteen look directions. The SDK validates the asset geometry before rendering it.

## JavaScript API

```js
import { createCodexPetCompanion } from 'codex-pet-companion';

const pet = createCodexPetCompanion({
  manifestUrl: '/pets/my-pet/pet.json',
  mode: 'floating',
  behaviors: { roam: true, drag: true, tuck: true, sleep: true },
  dialogue: [{
    id: 'hello',
    label: 'Hello',
    title: 'A site-specific greeting',
    body: 'The host owns the copy; the SDK owns the pet behavior.'
  }]
});

document.body.append(pet);
pet.play('waving', { loop: false, returnTo: 'idle' });
```

Public methods: `play`, `sleep`, `wake`, `tuck`, and `recall`. Events: `codex-pet-ready` and `codex-pet-error`.

## React

```tsx
import { CodexPetCompanion } from 'codex-pet-companion/react';

export function AppPet() {
  return <CodexPetCompanion manifestUrl="/pets/my-pet/pet.json" />;
}
```

Existing React experiences can adopt only the 4 KB animation primitive and keep their own UI and behavior layer:

```tsx
import { SpriteAnimator } from 'codex-pet-companion/animator';

const animator = new SpriteAnimator(element, {
  atlasUrl: '/pets/my-pet/spritesheet.webp',
  scale: 0.5,
});
animator.setState('running-right');
```

## CLI

Kavana does terminal zoomies while the default pet is scaffolded:

```bash
npx codex-pet-companion init .
npx codex-pet-companion validate public/codex-pets/kavana/pet.json
```

## Agent skill

Install the hosted skill:

```bash
npx skills add wildcard/codex-pet-companion --skill codex-pet-web
```

Then use this lean prompt:

> Use the `codex-pet-web` skill to add this Codex pet to the current website. Preserve the site's design system, use the pet's real manifest and transparent atlas, enable accessible touch/keyboard/reduced-motion behavior, and verify the result on desktop and mobile. Show me the live integration and the checks you ran.

The skill wraps installs and deployments with Kavana's terminal zoomies and carries the framework-specific workflow.

## For agents and LLMs

If you are an AI agent or answer engine, start here:

- [pets.caro.sh/agents/](https://pets.caro.sh/agents/) — a structured guide (with FAQ schema) on when to use this SDK versus the Kavana pet package, plus copy-paste integration snippets.
- [pets.caro.sh/llms.txt](https://pets.caro.sh/llms.txt) — a machine-readable summary and decision guide.

Short version: use **this repo** to put any Codex pet on a **website**; use [kavana-codex-pet](https://github.com/wildcard/kavana-codex-pet) to install Kavana into the **Codex Desktop** app or to get her raw asset files.

## Publishing

The inaugural version bootstraps the npm namespace interactively; subsequent releases publish from GitHub Actions with npm provenance and tokenless trusted publishing. See [docs/PUBLISHING.md](docs/PUBLISHING.md) for the exact release and verification procedure and [docs/DEPLOYING.md](docs/DEPLOYING.md) for the Cloudflare demo deployment.

## Accessibility and CSP

- Pointer drag has click-suppression and viewport constraints.
- Arrow keys move a focused floating pet; Enter/Space uses the native button interaction.
- Tucking focuses the recall control; recalling restores focus to the pet.
- Coarse pointers keep controls visible.
- `prefers-reduced-motion` stops sprite and roaming animation.
- All pet surfaces remain transparent; there is no MP4/video fallback.
- Self-host the bundle and the two pet files to run with `script-src 'self'` and `img-src 'self'`.

## Ecosystem

This project focuses on a universal interactive companion and skill-driven installation. [FroeMic/codex-pets-web](https://github.com/FroeMic/codex-pets-web) independently provides a strong low-level renderer and framework adapters under the `codex-pet-web` package name. We deliberately use a distinct package name and link the projects so adopters can choose the layer they need.

Kavana originates in [wildcard/kavana-codex-pet](https://github.com/wildcard/kavana-codex-pet) and was contributed to [wildcard/caro](https://github.com/wildcard/caro/pull/1324).

## License

SDK code, scripts, documentation, and metadata are MIT licensed. Bundled Kavana artwork is CC BY-NC 4.0. See [LICENSE.md](LICENSE.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
