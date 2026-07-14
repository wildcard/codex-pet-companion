import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const directory = await mkdtemp(join(tmpdir(), 'codex-pet-package-'));
try {
  const output = execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', directory], { encoding: 'utf8' });
  const packed = JSON.parse(output)[0];
  const files = new Set(packed.files.map((file) => file.path));
  for (const required of ['dist/index.js', 'dist/index.d.ts', 'dist/animator.js', 'dist/animator.d.ts', 'dist/codex-pet-companion.global.js', 'dist/cli.js', 'pets/kavana/pet.json', 'pets/kavana/spritesheet.webp', 'skills/codex-pet-web/SKILL.md']) {
    if (!files.has(required)) throw new Error(`Packed npm tarball is missing ${required}`);
  }
  const cli = await readFile('dist/cli.js', 'utf8');
  if (!cli.startsWith('#!/usr/bin/env node')) throw new Error('CLI is missing its Node shebang.');
  execFileSync('node', ['dist/cli.js', 'validate', 'pets/kavana/pet.json'], { stdio: 'inherit' });
  execFileSync('node', ['dist/cli.js', 'validate', 'fixtures/pets/kavana-v1/pet.json'], { stdio: 'inherit' });
  console.log(`✓ npm tarball contains ${packed.entryCount} files (${packed.size} bytes)`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
