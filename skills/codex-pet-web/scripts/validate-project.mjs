#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
if (!dependencies['codex-pet-companion']) throw new Error('codex-pet-companion is not installed.');
const candidates = ['public/codex-pets/kavana/pet.json', 'public/pets/kavana/pet.json'];
let found = false;
for (const candidate of candidates) {
  try { await access(resolve(root, candidate)); found = true; console.log(`✓ Found ${candidate}`); break; } catch { /* continue */ }
}
if (!found) console.warn('! No default Kavana manifest found; confirm the configured custom pet URL.');
console.log(`✓ codex-pet-companion ${dependencies['codex-pet-companion']} is declared`);
