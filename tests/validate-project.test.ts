import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const script = resolve('skills/codex-pet-web/scripts/validate-project.mjs');
const temporaryProjects: string[] = [];

function project(): string {
  const root = mkdtempSync(join(tmpdir(), 'codex-pet-project-'));
  temporaryProjects.push(root);
  return root;
}

afterEach(() => {
  for (const root of temporaryProjects.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('validate-project skill script', () => {
  it('reports a missing package.json without a stack trace', () => {
    const root = project();
    const result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim()).toBe(
      `✗ No package.json found in ${root}. Run this from your project root or pass a path: node validate-project.mjs <project-dir>`,
    );
    expect(result.stderr).not.toContain('Error:');
    expect(result.stderr).not.toMatch(/\n\s+at /);
  });

  it('still prints both checks for a valid initialized project', () => {
    const root = project();
    writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: { 'codex-pet-companion': '^0.2.0' } }));
    const manifest = join(root, 'public/codex-pets/kavana');
    mkdirSync(manifest, { recursive: true });
    writeFileSync(join(manifest, 'pet.json'), '{}');

    const output = execFileSync(process.execPath, [script, root], { encoding: 'utf8' });
    expect(output.trim().split('\n')).toEqual([
      '✓ Found public/codex-pets/kavana/pet.json',
      '✓ codex-pet-companion ^0.2.0 is declared',
    ]);
  });
});
