import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedAtlasSize, validateManifest } from './atlas.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';

function parseWebpDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Spritesheet is not a WebP file.');
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X') return { width: 1 + buffer.readUIntLE(data + 4, 3), height: 1 + buffer.readUIntLE(data + 7, 3) };
    if (type === 'VP8 ' && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }
    if (type === 'VP8L' && buffer[data] === 0x2f) {
      const bits = buffer.readUInt32LE(data + 1);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    offset = data + size + (size % 2);
  }
  throw new Error('Could not read WebP dimensions.');
}

async function zoomies(label = 'Kavana is helping'): Promise<void> {
  if (!process.stdout.isTTY || process.env.CI || process.env.NO_COLOR) {
    console.log(`🐕💨 ${label}`); return;
  }
  const width = Math.max(12, Math.min(42, (process.stdout.columns ?? 60) - label.length - 8));
  for (let lap = 0; lap < 2; lap += 1) {
    for (let index = 0; index < width; index += 2) {
      const x = lap % 2 ? width - index : index;
      process.stdout.write(`\r${' '.repeat(Math.max(0, x))}🐕💨 ${label}${' '.repeat(width)}`);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 26));
    }
  }
  process.stdout.write('\r\x1b[2K');
}

async function validatePet(manifestPath: string): Promise<void> {
  const absoluteManifest = resolve(manifestPath);
  const manifest = validateManifest(JSON.parse(await readFile(absoluteManifest, 'utf8')));
  const atlasPath = resolve(dirname(absoluteManifest), manifest.spritesheetPath);
  if (extname(atlasPath).toLowerCase() !== '.webp') throw new Error('spritesheetPath must point to a .webp file.');
  const dimensions = parseWebpDimensions(await readFile(atlasPath));
  const expected = expectedAtlasSize(manifest.spriteVersionNumber);
  if (dimensions.width !== expected.width || dimensions.height !== expected.height) {
    throw new Error(`Spritesheet is ${dimensions.width}x${dimensions.height}; expected ${expected.width}x${expected.height} for v${manifest.spriteVersionNumber}.`);
  }
  console.log(`✓ ${manifest.displayName}: valid Codex v${manifest.spriteVersionNumber} pet (${dimensions.width}x${dimensions.height})`);
}

async function initProject(targetArg?: string): Promise<void> {
  const target = resolve(targetArg ?? '.');
  const publicDir = resolve(target, args.includes('--public-dir') ? args[args.indexOf('--public-dir') + 1] : 'public');
  const petDir = join(publicDir, 'codex-pets', 'kavana');
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  await zoomies('installing Kavana');
  await mkdir(petDir, { recursive: true });
  await copyFile(join(packageRoot, 'pets', 'kavana', 'pet.json'), join(petDir, 'pet.json'));
  await copyFile(join(packageRoot, 'pets', 'kavana', 'spritesheet.webp'), join(petDir, 'spritesheet.webp'));
  const configPath = join(target, 'codex-pet.config.json');
  await writeFile(configPath, `${JSON.stringify({
    manifestUrl: '/codex-pets/kavana/pet.json', atlasUrl: '/codex-pets/kavana/spritesheet.webp',
    mode: 'floating', behaviors: { roam: true, drag: true, tuck: true, sleep: true },
  }, null, 2)}\n`, { flag: args.includes('--force') ? 'w' : 'wx' }).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'EEXIST') throw error;
  });
  console.log(`✓ Copied Kavana to ${petDir}`);
  console.log(`✓ Wrote ${configPath}`);
  console.log('\nAdd this before </body>:\n');
  console.log('<script type="module">\n  import "codex-pet-companion";\n</script>\n<codex-pet-companion manifest-url="/codex-pets/kavana/pet.json"></codex-pet-companion>');
}

function help(): void {
  console.log(`codex-pet-web — put any Codex pet on a website

Usage:
  codex-pet-web init [project] [--public-dir public] [--force]
  codex-pet-web validate path/to/pet.json
  codex-pet-web zoomies [message]

Kavana is the default fixture. Pass manifest-url/atlas-url in your website to use any valid Codex pet.`);
}

try {
  if (command === 'init') await initProject(args[1]?.startsWith('--') ? undefined : args[1]);
  else if (command === 'validate') {
    if (!args[1]) throw new Error('Pass the path to pet.json.');
    await validatePet(args[1]);
  } else if (command === 'zoomies') await zoomies(args.slice(1).join(' ') || 'zoomies');
  else help();
} catch (error) {
  console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

export { parseWebpDimensions };
