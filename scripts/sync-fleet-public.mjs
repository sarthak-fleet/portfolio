import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
const source = new URL(
  '../../saas-maker/catalog/generated/public.json',
  import.meta.url
);
const target = new URL('../src/data/fleet-public.json', import.meta.url);
const text = await readFile(source, 'utf8');
const catalog = JSON.parse(text);
if (!catalog.directory?.every((project) => project.shareable === true)) {
  throw new Error('Only a verified public projection may be synchronized');
}
if (process.argv.includes('--check')) {
  if (!isDeepStrictEqual(JSON.parse(await readFile(target, 'utf8')), catalog))
    throw new Error('Public projection is stale');
} else {
  await writeFile(target, text);
  execFileSync(
    'npm',
    [
      'exec',
      '--',
      'biome',
      'format',
      '--write',
      '--json-formatter-enabled=true',
      fileURLToPath(target),
    ],
    {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      stdio: 'inherit',
    }
  );
}
console.log(`Public projection: ${catalog.directory.length} shareable entries`);
