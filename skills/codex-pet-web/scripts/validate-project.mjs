#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const packageJsonPath = resolve(root, 'package.json');
let packageJsonSource;
try {
  packageJsonSource = await readFile(packageJsonPath, 'utf8');
} catch (error) {
  const detail = error?.code === 'ENOENT' ? 'No package.json found' : 'Could not read package.json';
  console.error(`✗ ${detail} in ${root}. Run this from your project root or pass a path: node validate-project.mjs <project-dir>`);
  process.exit(1);
}

let packageJson;
try {
  packageJson = JSON.parse(packageJsonSource);
} catch {
  console.error(`✗ Invalid package.json in ${root}. Fix its JSON syntax or pass a valid project path: node validate-project.mjs <project-dir>`);
  process.exit(1);
}

const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
if (!dependencies['codex-pet-companion']) {
  console.error(`✗ codex-pet-companion is not declared in ${packageJsonPath}. Install it before validating this project.`);
  process.exit(1);
}
const candidates = ['public/codex-pets/kavana/pet.json', 'public/pets/kavana/pet.json'];
let found = false;
for (const candidate of candidates) {
  try { await access(resolve(root, candidate)); found = true; console.log(`✓ Found ${candidate}`); break; } catch { /* continue */ }
}
if (!found) console.warn('! No default Kavana manifest found; confirm the configured custom pet URL.');
console.log(`✓ codex-pet-companion ${dependencies['codex-pet-companion']} is declared`);
