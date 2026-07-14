import { cp, mkdir, rm } from 'node:fs/promises';

await rm('site', { recursive: true, force: true });
await mkdir('site/pets/kavana', { recursive: true });
await mkdir('site/fixtures/v1', { recursive: true });
await cp('docs', 'site', { recursive: true });
await cp('dist/codex-pet-companion.global.js', 'site/codex-pet-companion.global.js');
await cp('pets/kavana', 'site/pets/kavana', { recursive: true });
await cp('fixtures/pets/kavana-v1', 'site/fixtures/v1', { recursive: true });
console.log('✓ Built static demo in site/');
