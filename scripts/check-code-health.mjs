#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const root = resolve(dirname(currentFile), '..');
const paths = ['src', 'astro.config.mjs'];
const baselines = {
  format: { errors: 0 },
  types: { errors: 0, warnings: 0, hints: 0 },
  unused: {
    files: 0,
    exports: 0,
    types: 0,
    dependencies: 0,
    devDependencies: 0,
    unlisted: 0,
    unresolved: 0,
  },
  complexity: { violations: 0, maxCcn: 13, maxLength: 92, maxParams: 2 },
  duplication: { clones: 0, duplicatedLines: 0, percentage: 0 },
  suppressions: 0,
  dependencies: { criticalIds: 0, highIds: 10, highFindings: 7 },
};
const acceptedHigh = new Set([
  'GHSA-28wg-ghj8-5hjv',
  'GHSA-2p49-hgcm-8545',
  'GHSA-2pvr-wf23-7pc7',
  'GHSA-2v37-7h3g-55p8',
  'GHSA-52cp-r559-cp3m',
  'GHSA-5p4m-2wfm-xmqj',
  'GHSA-8hv8-536x-4wqp',
  'GHSA-f88m-g3jw-g9cj',
  'GHSA-fx2h-pf6j-xcff',
  'GHSA-r28c-9q8g-f849',
]);

function output(message) {
  process.stdout.write(`${message}\n`);
}

function run(command, args, allowFailure = false) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    throw new Error(`${command} exited with status ${result.status}`);
  }
  return result;
}

function json(result, label) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${label} did not return JSON`, { cause: error });
  }
}

function regress(label, observed, baseline) {
  const failures = Object.entries(baseline).filter(
    ([key, maximum]) => observed[key] > maximum
  );
  if (failures.length) {
    throw new Error(
      failures
        .map(
          ([key, maximum]) => `${label} ${key}: ${observed[key]} > ${maximum}`
        )
        .join('\n')
    );
  }
  if (
    Object.entries(baseline).some(([key, maximum]) => observed[key] < maximum)
  ) {
    output(`${label} improved; lower the baseline intentionally.`);
  }
}

function count(issues, key) {
  return issues.reduce((sum, issue) => sum + (issue[key]?.length ?? 0), 0);
}

function format() {
  const report = json(
    run(
      'npm',
      [
        'exec',
        '--',
        'biome',
        'format',
        '.',
        '--javascript-formatter-enabled=true',
        '--javascript-formatter-quote-style=single',
        '--json-formatter-enabled=true',
        '--css-formatter-enabled=true',
        '--html-formatter-enabled=true',
        '--reporter=json',
        '--max-diagnostics=none',
      ],
      true
    ),
    'Biome format'
  );
  const observed = { errors: report.summary?.errors ?? 0 };
  output(`Format: ${observed.errors} accepted unformatted files.`);
  regress('Format', observed, baselines.format);
}

function types() {
  const result = run('npm', ['exec', '--', 'astro', 'check'], true);
  const text = `${result.stdout}\n${result.stderr}`;
  const match = text.match(
    /(\d+) errors?\s*-\s*(\d+) warnings?\s*-\s*(\d+) hints?/u
  );
  if (!match) throw new Error('Astro check did not report diagnostic totals.');
  const observed = {
    errors: Number(match[1]),
    warnings: Number(match[2]),
    hints: Number(match[3]),
  };
  output(
    `Types: ${observed.errors} errors, ${observed.warnings} warnings, ${observed.hints} hints.`
  );
  regress('Types', observed, baselines.types);
  if (result.status !== 0) {
    throw new Error(`Astro check exited with status ${result.status}`);
  }
}

function unused() {
  const issues =
    json(
      run(
        'npm',
        [
          'exec',
          '--',
          'knip',
          '--reporter',
          'json',
          '--no-exit-code',
          '--no-progress',
        ],
        true
      ),
      'Knip'
    ).issues ?? [];
  const observed = Object.fromEntries(
    Object.keys(baselines.unused).map((key) => [key, count(issues, key)])
  );
  output(
    `Unused: ${Object.entries(observed)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')}.`
  );
  regress('Unused', observed, baselines.unused);
}

function complexity() {
  const result = run('uvx', [
    '--from',
    'lizard==1.23.0',
    'lizard',
    ...paths,
    '-x',
    '**/*.test.*',
    '-x',
    'src/data/**',
    '-x',
    'scripts/check-code-health.mjs',
    '--csv',
  ]);
  const rows = result.stdout
    .trim()
    .split('\n')
    .map((line) => line.match(/^(\d+),(\d+),(\d+),(\d+),(\d+),/u))
    .filter(Boolean)
    .map((match) => match.slice(1).map(Number));
  const observed = {
    functions: rows.length,
    nloc: rows.reduce((sum, row) => sum + row[0], 0),
    violations: rows.filter((row) => row[1] > 15 || row[4] > 100 || row[3] > 7)
      .length,
    maxCcn: Math.max(0, ...rows.map((row) => row[1])),
    maxLength: Math.max(0, ...rows.map((row) => row[4])),
    maxParams: Math.max(0, ...rows.map((row) => row[3])),
  };
  output(
    `Complexity: ${observed.functions} functions, ${observed.nloc} NLOC, ${observed.violations} violations; max ${observed.maxCcn}/${observed.maxLength}/${observed.maxParams}.`
  );
  regress('Complexity', observed, baselines.complexity);
}

function duplication() {
  const outputDirectory = mkdtempSync(join(tmpdir(), 'portfolio-jscpd-'));
  run('npm', [
    'exec',
    '--',
    'jscpd',
    ...paths,
    '--min-lines',
    '8',
    '--min-tokens',
    '60',
    '--mode',
    'strict',
    '--ignore',
    '**/*.test.*,**/data/**,**/content/**,**/node_modules/**,**/dist/**,**/coverage/**,scripts/check-code-health.mjs',
    '--reporters',
    'json',
    '--output',
    outputDirectory,
    '--silent',
    '--no-tips',
  ]);
  const observed = JSON.parse(
    readFileSync(join(outputDirectory, 'jscpd-report.json'), 'utf8')
  ).statistics.total;
  output(
    `Duplication: ${observed.clones} groups, ${observed.duplicatedLines}/${observed.lines} lines (${observed.percentage.toFixed(4)}%).`
  );
  regress('Duplication', observed, baselines.duplication);
}

function cycles() {
  const issues =
    json(
      run(
        'npm',
        [
          'exec',
          '--',
          'knip',
          '--cycles',
          '--reporter',
          'json',
          '--no-exit-code',
          '--no-progress',
        ],
        true
      ),
      'Knip cycles'
    ).issues ?? [];
  const found = issues.flatMap((issue) => issue.cycles ?? []);
  if (found.length) {
    throw new Error(`${found.length} dependency cycles detected.`);
  }
  output('Cycles: zero JavaScript or TypeScript import cycles.');
}

function dependencies() {
  const report = json(run('npm', ['audit', '--json'], true), 'npm audit');
  const advisories = Object.values(report.vulnerabilities ?? {}).flatMap(
    (item) => item.via?.filter((via) => typeof via === 'object') ?? []
  );
  const ids = (severity) =>
    new Set(
      advisories
        .filter((item) => item.severity === severity)
        .map((item) => item.url?.match(/\/advisories\/(GHSA-[\w-]+)/u)?.[1])
        .filter(Boolean)
    );
  const criticalIds = ids('critical');
  const highIds = ids('high');
  const unexpected = [
    ...criticalIds,
    ...[...highIds].filter((id) => !acceptedHigh.has(id)),
  ];
  const observed = {
    criticalIds: criticalIds.size,
    highIds: highIds.size,
    highFindings: report.metadata?.vulnerabilities?.high ?? 0,
  };
  output(
    `Dependencies: ${observed.criticalIds} critical IDs, ${observed.highIds} accepted high IDs across ${observed.highFindings} high package findings; ${unexpected.length} unexpected.`
  );
  if (unexpected.length) {
    throw new Error(`Unexpected severe advisories: ${unexpected.join(', ')}`);
  }
  regress('Dependencies', observed, baselines.dependencies);
}

const suppression =
  /eslint-disable|@ts-ignore|@ts-expect-error|istanbul ignore|c8 ignore|(?:test|base)\.skip\(|\bTODO\b|\bFIXME\b/u;
const extensions = new Set([
  '.astro',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
]);
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? files(path)
      : entry.isFile() && extensions.has(extname(entry.name))
        ? [path]
        : [];
  });
}
function suppressions() {
  const found = [
    ...files(resolve(root, 'src')),
    ...files(resolve(root, 'scripts')),
  ]
    .filter((file) => file !== currentFile)
    .flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => suppression.test(line))
    );
  output(`Suppressions: ${found.length} authored markers.`);
  if (found.length > baselines.suppressions) {
    throw new Error(
      `Suppressions regressed: ${found.length} > ${baselines.suppressions}`
    );
  }
}

function hygiene() {
  run('git', [
    'diff',
    '--check',
    'HEAD',
    '--',
    ...paths,
    'scripts',
    '.github',
    'package.json',
    'package-lock.json',
    'knip.json',
  ]);
  const conflicts = run(
    'git',
    ['grep', '-nE', '^(<<<<<<< |=======|>>>>>>> )', '--', '.'],
    true
  );
  if (conflicts.status === 0) {
    throw new Error(`Conflict markers found:\n${conflicts.stdout}`);
  }
  const generated = run('git', ['ls-files', '--others', '--exclude-standard'])
    .stdout.trim()
    .split('\n')
    .filter(Boolean)
    .filter((file) =>
      /(^|\/)(coverage|dist|\.astro|\.wrangler)(\/|$)|\.tsbuildinfo$/u.test(
        file
      )
    );
  if (generated.length) {
    throw new Error(`Untracked generated files: ${generated.join(', ')}`);
  }
  output('Repository hygiene passes.');
}

const checks = {
  format,
  types,
  unused,
  complexity,
  duplication,
  cycles,
  dependencies,
  suppressions,
  hygiene,
};
const [, , selected] = process.argv;
if (Object.hasOwn(checks, selected)) {
  try {
    checks[selected]();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
} else process.exitCode = 2;
