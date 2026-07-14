# Publishing Codex Pet Web SDK

After the one-time namespace bootstrap, the package is released from GitHub Actions so npm can attach a verifiable provenance statement to every subsequent public version. Do not publish later release builds from a developer laptop.

## One-time first-release bootstrap

npm cannot attach a trusted publisher to a package until that package exists. Bootstrap the namespace once from an authenticated workstation, then remove every temporary credential immediately:

1. Sign in to the npm account that will own `codex-pet-companion` and enable two-factor authentication.
2. Confirm `main` is green and `npm view codex-pet-companion` still returns `E404` before the inaugural release.
3. From that exact verified checkout, run `npm publish --access public --provenance=false` and complete npm's interactive 2FA challenge. This first namespace-creation release has a registry signature but cannot have GitHub provenance because the trusted publisher does not exist yet.
4. Verify the registry and both CDN entrypoints using the commands below.
5. Continue immediately with the trusted-publisher setup below before preparing another version.

## Switch immediately to trusted publishing

After `0.1.0` exists, authenticate npm CLI interactively and use npm 11.5.1 or newer to register the exact GitHub workflow:

```bash
npx npm@latest trust github codex-pet-companion \
  --repo wildcard/codex-pet-companion \
  --file publish.yml \
  --env npm \
  --allow-publish \
  --yes
```

Then:

1. Revoke the workstation login token and delete any temporary granular token or repository secret used while troubleshooting the bootstrap.
2. In npm package settings, require 2FA and disallow token-based publishing.
3. Keep the GitHub `npm` environment and `id-token: write` permission unchanged.
4. Publish all later versions by creating a GitHub release from a green, tagged commit. The workflow has no `NODE_AUTH_TOKEN`; npm exchanges the GitHub OIDC identity directly.

## Release verification

Run this only after the publish workflow succeeds:

```bash
npm view codex-pet-companion@0.2.0 version dist-tags repository license
npm pack codex-pet-companion@0.2.0 --dry-run

workdir="$(mktemp -d)"
cd "$workdir"
npm init -y
npm install codex-pet-companion@0.2.0
node -e "import('codex-pet-companion').then(m => console.log(Boolean(m.createCodexPetCompanion)))"
node -e "import('codex-pet-companion/animator').then(m => console.log(Boolean(m.SpriteAnimator)))"
```

Verify these pinned browser URLs return JavaScript and then run the clean static-page browser suite:

- `https://unpkg.com/codex-pet-companion@0.2.0/dist/codex-pet-companion.global.js`
- `https://cdn.jsdelivr.net/npm/codex-pet-companion@0.2.0/dist/codex-pet-companion.global.js`

Finally, run `npm audit signatures` in the clean installation. For `0.1.0`, confirm the registry signature; for every later release, also confirm npm shows the provenance link back to the tagged GitHub workflow and source commit.
