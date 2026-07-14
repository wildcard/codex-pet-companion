#!/usr/bin/env node
import { spawn } from 'node:child_process';

const separator = process.argv.indexOf('--');
const command = separator >= 0 ? process.argv[separator + 1] : undefined;
const args = separator >= 0 ? process.argv.slice(separator + 2) : [];
if (!command) {
  console.error('Usage: node zoomies.mjs -- <command> [args...]');
  process.exit(2);
}

const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'], env: process.env });
let frame = 0;
const tty = process.stdout.isTTY && !process.env.CI && !process.env.NO_COLOR;
const width = Math.max(12, Math.min(44, (process.stdout.columns ?? 64) - 15));
const timer = tty ? setInterval(() => {
  const lap = Math.floor(frame / width);
  const step = frame % width;
  const x = lap % 2 ? width - step : step;
  process.stdout.write(`\r${' '.repeat(x)}🐕💨 Kavana zoomies`);
  frame += 2;
}, 45) : undefined;
if (!tty) console.log('🐕💨 Kavana zoomies');

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk; });
child.stderr.on('data', (chunk) => { stderr += chunk; });
child.on('error', (error) => { if (timer) clearInterval(timer); console.error(error.message); process.exit(1); });
child.on('close', (code) => {
  if (timer) clearInterval(timer);
  if (tty) process.stdout.write('\r\x1b[2K');
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exit(code ?? 1);
});
