import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';

const budgets = [
  ['dist/index.js', 64_000],
  ['dist/codex-pet-companion.global.js', 72_000],
];
for (const [file, maxGzip] of budgets) {
  const bytes = await readFile(file);
  const gzip = gzipSync(bytes).byteLength;
  const raw = (await stat(file)).size;
  if (gzip > maxGzip) throw new Error(`${file} is ${gzip} bytes gzip; budget is ${maxGzip}.`);
  console.log(`✓ ${file}: ${raw} raw / ${gzip} gzip (budget ${maxGzip})`);
}
