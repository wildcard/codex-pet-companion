import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const example = resolve(process.argv[2] ?? '.');
const target = resolve(example, 'public/pets/kavana');
await mkdir(target, { recursive: true });
await cp(resolve(import.meta.dirname, '../pets/kavana'), target, { recursive: true });
console.log(`✓ Copied Kavana into ${target}`);
