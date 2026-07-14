import { access, readFile, readdir } from 'node:fs/promises';

const root = 'skills/codex-pet-web';
const source = await readFile(`${root}/SKILL.md`, 'utf8');
const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontmatter) throw new Error('SKILL.md needs YAML frontmatter.');
const fields = frontmatter[1].split('\n').map((line) => line.split(':', 1)[0]);
if (fields.join(',') !== 'name,description') throw new Error('Skill frontmatter must contain only name and description.');
if (!frontmatter[1].includes('name: codex-pet-web')) throw new Error('Skill name is incorrect.');
for (const path of ['scripts/zoomies.mjs', 'scripts/validate-project.mjs', 'references/react.md', 'references/static-html.md']) await access(`${root}/${path}`);
const top = await readdir(root);
for (const forbidden of ['README.md', 'CHANGELOG.md', 'QUICK_REFERENCE.md']) if (top.includes(forbidden)) throw new Error(`Skill contains forbidden extra file ${forbidden}.`);
console.log('✓ codex-pet-web skill structure and resources are valid');
