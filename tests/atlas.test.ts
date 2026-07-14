import { describe, expect, it } from 'vitest';
import { assertAtlasDimensions, expectedAtlasSize, isStateSupported, resolveAtlasUrl, validateManifest } from '../src/atlas.js';

describe('Codex pet validation', () => {
  it('defaults legacy manifests to v1', () => {
    expect(validateManifest({ id: 'one', displayName: 'One', spritesheetPath: 'spritesheet.webp' }).spriteVersionNumber).toBe(1);
    expect(expectedAtlasSize(1)).toEqual({ width: 1536, height: 1872, rows: 9 });
  });

  it('supports v2 geometry and look directions', () => {
    const manifest = validateManifest({ id: 'two', displayName: 'Two', spritesheetPath: 'spritesheet.webp', spriteVersionNumber: 2 });
    expect(manifest.spriteVersionNumber).toBe(2);
    expect(expectedAtlasSize(2)).toEqual({ width: 1536, height: 2288, rows: 11 });
    expect(isStateSupported('look-around', 2)).toBe(true);
    expect(isStateSupported('look-around', 1)).toBe(false);
  });

  it('rejects malformed manifests and wrong dimensions', () => {
    expect(() => validateManifest({ id: 'bad' })).toThrow(/displayName/);
    expect(() => assertAtlasDimensions(1536, 1872, 2)).toThrow(/requires 1536x2288/);
  });

  it('resolves atlas paths next to the manifest', () => {
    const manifest = validateManifest({ id: 'pet', displayName: 'Pet', spritesheetPath: './atlas.webp' });
    expect(resolveAtlasUrl(manifest, 'https://example.com/pets/pet.json')).toBe('https://example.com/pets/atlas.webp');
    expect(resolveAtlasUrl(manifest, '/pets/pet.json')).toBe('https://codex-pet.invalid/pets/atlas.webp');
  });
});
