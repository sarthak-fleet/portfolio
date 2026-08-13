import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mergeRepos,
  normalizeRepo,
  resolveProjectGroups,
} from '../src/lib/github-core.ts';

function repo(overrides = {}) {
  return {
    name: 'alpha',
    description: null,
    url: 'https://github.com/example/alpha',
    homepage: null,
    language: 'TypeScript',
    stars: 1,
    forks: 0,
    topics: [],
    archived: false,
    updated: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

test('normalizeRepo rejects forks and malformed identities', () => {
  assert.equal(normalizeRepo({ fork: true }), null);
  assert.equal(normalizeRepo({ name: 'missing-url' }), null);
  assert.equal(normalizeRepo({ html_url: 'https://example.com' }), null);
});

test('normalizeRepo maps GitHub payloads and safe defaults', () => {
  assert.deepEqual(
    normalizeRepo({
      name: 'full',
      html_url: 'https://github.com/example/full',
      description: 'A repository',
      homepage: 'https://example.com',
      language: 'Go',
      stargazers_count: 7,
      forks_count: 2,
      topics: ['one', 2, 'three'],
      archived: true,
      pushed_at: '2026-03-01T00:00:00Z',
    }),
    {
      name: 'full',
      description: 'A repository',
      url: 'https://github.com/example/full',
      homepage: 'https://example.com',
      language: 'Go',
      stars: 7,
      forks: 2,
      topics: ['one', 'three'],
      archived: true,
      updated: '2026-03-01T00:00:00Z',
    }
  );

  assert.deepEqual(normalizeRepo({ name: 'minimal', html_url: 'minimal' }), {
    name: 'minimal',
    description: null,
    url: 'minimal',
    homepage: null,
    language: null,
    stars: 0,
    forks: 0,
    topics: [],
    archived: false,
    updated: '',
  });

  assert.equal(
    normalizeRepo({
      name: 'updated',
      html_url: 'updated',
      homepage: '',
      updated_at: '2026-02-01T00:00:00Z',
    })?.updated,
    '2026-02-01T00:00:00Z'
  );
});

test('mergeRepos deduplicates URLs and sorts by stars then freshness', () => {
  const older = repo({ name: 'older', url: 'older', stars: 2 });
  const newer = repo({
    name: 'newer',
    url: 'newer',
    stars: 2,
    updated: '2026-02-01T00:00:00Z',
  });
  const popular = repo({ name: 'popular', url: 'popular', stars: 9 });
  const duplicate = repo({ name: 'duplicate', url: 'OLDER', stars: 99 });

  assert.deepEqual(
    mergeRepos([older, newer, popular, duplicate]).map(({ name }) => name),
    ['popular', 'newer', 'older']
  );
});

test('resolveProjectGroups keeps curated order and omits missing groups', () => {
  const alpha = repo();
  const beta = repo({ name: 'beta', url: 'beta' });
  const groups = resolveProjectGroups(
    [alpha, beta],
    [
      {
        label: 'Selected',
        intro: 'Chosen work',
        projects: [
          { repo: 'BETA', summary: 'Curated beta' },
          { repo: 'missing', summary: 'Not public' },
          { repo: 'alpha', summary: 'Curated alpha' },
        ],
      },
      {
        label: 'Empty',
        intro: 'No matches',
        projects: [{ repo: 'missing', summary: 'Missing' }],
      },
    ]
  );

  assert.deepEqual(groups, [
    {
      label: 'Selected',
      intro: 'Chosen work',
      repos: [
        { ...beta, description: 'Curated beta' },
        { ...alpha, description: 'Curated alpha' },
      ],
    },
  ]);
});
