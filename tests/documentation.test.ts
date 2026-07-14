import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readme = readFileSync('README.md', 'utf8');
const staticReference = readFileSync('skills/codex-pet-web/references/static-html.md', 'utf8');
const reactReference = readFileSync('skills/codex-pet-web/references/react.md', 'utf8');

describe('installation documentation', () => {
  it('warns that the bare element conflicts with a self-only CSP', () => {
    expect(readme).toContain("the bare element still loads Kavana's `pet.json` and `spritesheet.webp` from unpkg");
    expect(readme).toContain('`connect-src \'self\'` and `img-src \'self\'`');
    expect(readme).toContain('npx codex-pet-companion init .');
    expect(staticReference).toContain('The bare element requires unpkg in `connect-src` and `img-src`.');
  });

  it('uses the same codex-pets path convention as init', () => {
    for (const documentation of [readme, staticReference, reactReference]) {
      expect(documentation).not.toContain('="/pets/my-pet/');
      expect(documentation).toContain('/codex-pets/my-pet/');
    }
  });

  it('documents both package bins and the command-wrapper separator', () => {
    expect(readme).toContain('`codex-pet-companion` and `codex-pet-web` are aliases');
    expect(readme).toContain('node .agents/skills/codex-pet-web/scripts/zoomies.mjs -- npm test');
    expect(readme).toContain('The `--` separator is required');
  });
});
