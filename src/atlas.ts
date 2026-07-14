import type { CodexPetManifest, CompanionState, SpriteFrame } from './types.js';

export const CELL_WIDTH = 192;
export const CELL_HEIGHT = 208;
export const ATLAS_COLUMNS = 8;

const row = (rowIndex: number, durations: number[]): SpriteFrame[] => durations.map((duration, column) => ({ row: rowIndex, column, duration }));

export const DEFAULT_SEQUENCES: Record<CompanionState, SpriteFrame[]> = {
  idle: row(0, [280, 110, 110, 140, 140, 320]),
  'running-right': row(1, [120, 120, 120, 120, 120, 120, 120, 220]),
  'running-left': row(2, [120, 120, 120, 120, 120, 120, 120, 220]),
  waving: row(3, [140, 140, 140, 280]),
  jumping: row(4, [140, 140, 140, 140, 280]),
  failed: row(5, [140, 140, 140, 140, 140, 140, 140, 240]),
  waiting: row(6, [150, 150, 150, 150, 150, 260]),
  running: row(7, [120, 120, 120, 120, 120, 220]),
  review: row(8, [150, 150, 150, 150, 150, 280]),
  'look-around': [...row(9, [190, 150, 150, 150, 190, 150, 150, 150]), ...row(10, [190, 150, 150, 150, 190, 150, 150, 240])],
  resting: [
    { row: 6, column: 2, duration: 650 }, { row: 6, column: 3, duration: 220 },
    { row: 6, column: 4, duration: 650 }, { row: 6, column: 3, duration: 220 },
  ],
  sleeping: [
    { row: 5, column: 2, duration: 320 }, { row: 5, column: 3, duration: 420 },
    { row: 5, column: 4, duration: 1400 }, { row: 5, column: 5, duration: 520 },
    { row: 5, column: 4, duration: 1400 },
  ],
};

export function validateManifest(value: unknown): CodexPetManifest {
  if (!value || typeof value !== 'object') throw new Error('pet.json must contain an object.');
  const manifest = value as Record<string, unknown>;
  for (const field of ['id', 'displayName', 'spritesheetPath'] as const) {
    if (typeof manifest[field] !== 'string' || !manifest[field]) throw new Error(`pet.json is missing a non-empty ${field}.`);
  }
  const version = manifest.spriteVersionNumber ?? 1;
  if (version !== 1 && version !== 2) throw new Error('spriteVersionNumber must be 1 or 2.');
  return {
    id: manifest.id as string,
    displayName: manifest.displayName as string,
    description: typeof manifest.description === 'string' ? manifest.description : undefined,
    spriteVersionNumber: version,
    spritesheetPath: manifest.spritesheetPath as string,
  };
}

export function expectedAtlasSize(version = 1): { width: number; height: number; rows: number } {
  const rows = version === 2 ? 11 : 9;
  return { width: CELL_WIDTH * ATLAS_COLUMNS, height: CELL_HEIGHT * rows, rows };
}

export function assertAtlasDimensions(width: number, height: number, version = 1): void {
  const expected = expectedAtlasSize(version);
  if (width !== expected.width || height !== expected.height) {
    throw new Error(`Spritesheet is ${width}x${height}; Codex v${version} requires ${expected.width}x${expected.height}.`);
  }
}

export function resolveAtlasUrl(manifest: CodexPetManifest, manifestUrl?: string, explicitAtlasUrl?: string): string {
  if (explicitAtlasUrl) return explicitAtlasUrl;
  if (manifestUrl) {
    const documentBase = typeof document !== 'undefined' ? document.baseURI : 'https://codex-pet.invalid/';
    return new URL(manifest.spritesheetPath, new URL(manifestUrl, documentBase)).href;
  }
  return manifest.spritesheetPath;
}

export function isStateSupported(state: CompanionState, version = 1): boolean {
  return state !== 'look-around' || version === 2;
}
