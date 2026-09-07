import { readFile, writeFile } from 'node:fs/promises';
const source = new URL('../../saas-maker/catalog/generated/public.json', import.meta.url);
const target = new URL('../src/data/fleet-public.json', import.meta.url);
const text = await readFile(source, 'utf8');
const catalog = JSON.parse(text);
if (!catalog.directory?.every((project) => project.shareable === true)) {
  throw new Error('Only a verified public projection may be synchronized');
}
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== text) throw new Error('Public projection is stale');
} else {
  await writeFile(target, text);
}
console.log(`Public projection: ${catalog.directory.length} shareable entries`);
