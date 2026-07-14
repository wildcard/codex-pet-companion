import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', animator: 'src/animator.ts', react: 'src/react.tsx' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    external: ['react'],
    target: 'es2022',
  },
  {
    entry: { 'codex-pet-companion': 'src/cdn.ts' },
    format: ['iife'],
    globalName: 'CodexPetWeb',
    outExtension: () => ({ js: '.global.js' }),
    minify: true,
    sourcemap: true,
    splitting: false,
    target: 'es2020',
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    banner: { js: '#!/usr/bin/env node' },
    target: 'node20',
    splitting: false,
  },
]);
