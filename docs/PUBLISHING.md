# Publishing Codex Pet Web SDK

The package is released from GitHub Actions so npm can attach a verifiable provenance statement to every public version. Do not publish a release build from a developer laptop.

## One-time first-release bootstrap

npm cannot attach a trusted publisher to a package until that package exists. The first release therefore uses one temporary granular npm token from the GitHub-hosted release workflow:

1. Sign in to the npm account that will own `codex-pet-companion` and enable two-factor authentication.
2. Create a short-lived granular access token with permission to publish public packages.
3. Add it to `wildcard/codex-pet-companion` as the GitHub Actions secret `NPM_TOKEN`. Never place the token in a file, command argument, issue, or log.
4. Confirm `main` is green and `npm view codex-pet-companion` still returns `E404` before the inaugural release.
5. Create GitHub release `v0.1.0` from the verified commit. `.github/workflows/publish.yml` runs the full verification matrix and publishes with provenance.
6. Verify the registry and both CDN entrypoints using the commands below.

The workflow's `NODE_AUTH_TOKEN` is deliberately compatible with both states: it carries the bootstrap token when the secret exists, then remains empty when npm OIDC is active.

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

1. Delete the `NPM_TOKEN` repository secret.
2. In npm package settings, require 2FA and disallow token-based publishing.
3. Keep the GitHub `npm` environment and `id-token: write` permission unchanged.
4. Publish all later versions by creating a GitHub release from a green, tagged commit.

## Release verification

Run this only after the publish workflow succeeds:

```bash
npm view codex-pet-companion@0.1.0 version dist-tags repository license
npm pack codex-pet-companion@0.1.0 --dry-run

workdir="$(mktemp -d)"
cd "$workdir"
npm init -y
npm install codex-pet-companion@0.1.0
node -e "import('codex-pet-companion').then(m => console.log(Boolean(m.createCodexPetCompanion)))"
node -e "import('codex-pet-companion/animator').then(m => console.log(Boolean(m.SpriteAnimator)))"
```

Verify these pinned browser URLs return JavaScript and then run the clean static-page browser suite:

- `https://unpkg.com/codex-pet-companion@0.1.0/dist/codex-pet-companion.global.js`
- `https://cdn.jsdelivr.net/npm/codex-pet-companion@0.1.0/dist/codex-pet-companion.global.js`

Finally, run `npm audit signatures` in the clean installation and confirm npm shows the provenance link back to the tagged GitHub workflow and source commit.
