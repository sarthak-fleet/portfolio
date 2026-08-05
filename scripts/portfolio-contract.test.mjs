// Portfolio content contract test.
//
// Validates the canonical four-product presentation plus SaaS Maker as the
// directory entry point on the personal homepage. Runs with `node --test` —
// no test framework dependency. Guards against:
//   - a primary product being omitted from the spotlight set
//   - a Toolbox project (RolePatch, Karte, etc.) being promoted into the
//     primary set
//   - SaaS Maker losing its distinct directory CTA copy
//
// Source of truth for the spotlight contract is
// `fleet-ops/config/spotlight-products.json`; this test mirrors the
// portfolio-side consumption of that contract so a local portfolio change
// cannot silently drift.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const PRIMARY_PRODUCT_IDS = ['codevetter', 'posttrainllm', 'heypace', 'hisignal'];
const DIRECTORY_PRODUCT_ID = 'saas-maker';
const EXPECTED_PRODUCT_URLS = {
  codevetter: 'https://codevetter.com',
  posttrainllm: 'https://posttrainllm.com',
  heypace: 'https://heypace.app',
  hisignal: 'https://highsignal.app',
  'saas-maker': 'https://sassmaker.com',
};
// Toolbox surfaces must never appear in the homepage spotlight set.
const FORBIDDEN_TOOLBOX_IDS = ['rolepatch', 'karte', 'linkchat', 'resume-tailor'];

async function readSpotlightSource() {
  return readFile(`${ROOT}/src/data/spotlight-products.ts`, 'utf8');
}

async function readHomepageSource() {
  return readFile(`${ROOT}/src/pages/index.astro`, 'utf8');
}

async function readSiteSource() {
  return readFile(`${ROOT}/src/data/site.ts`, 'utf8');
}

async function readHeadSource() {
  return readFile(`${ROOT}/src/components/astro/Head.astro`, 'utf8');
}

test('spotlight data declares exactly the four primary products plus SaaS Maker as directory', async () => {
  const source = await readSpotlightSource();
  for (const id of PRIMARY_PRODUCT_IDS) {
    assert.match(source, new RegExp(`id: '${id}'`), `primary product ${id} missing from spotlight`);
    assert.match(source, new RegExp(EXPECTED_PRODUCT_URLS[id].replace(/\./g, '\\.')), `primary product ${id} URL missing`);
  }
  assert.match(source, new RegExp(`id: '${DIRECTORY_PRODUCT_ID}'`), 'SaaS Maker directory entry missing from spotlight');
  assert.match(source, /https:\/\/sassmaker\.com/, 'SaaS Maker directory URL missing');
});

test('spotlight data does not promote Toolbox projects into the primary set', async () => {
  const source = await readSpotlightSource();
  for (const forbidden of FORBIDDEN_TOOLBOX_IDS) {
    assert.doesNotMatch(source, new RegExp(`id: '${forbidden}'`), `Toolbox project ${forbidden} must not appear in spotlight`);
  }
});

test('homepage renders the spotlight set with a distinct directory CTA for SaaS Maker', async () => {
  const home = await readHomepageSource();
  const spotlightImport = await readSpotlightSource();
  // Homepage must import and render the spotlight data — not a parallel list.
  assert.match(home, new RegExp("from '@/data/spotlight-products'"), 'homepage must consume spotlight-products data');
  assert.match(home, /spotlightProducts\.map/, 'homepage must render the spotlight collection');
  // SaaS Maker must keep its distinct directory CTA copy so it is not
  // presented as a peer product.
  assert.match(home, /open the directory/, 'SaaS Maker must keep its distinct directory CTA copy');
  // The four primary products must each appear via the spotlight import —
  // guard against the homepage hardcoding a different set.
  for (const id of PRIMARY_PRODUCT_IDS) {
    assert.match(spotlightImport, new RegExp(`id: '${id}'`), `spotlight source missing ${id}`);
  }
});

test('homepage declares one meaningful CTA in the hero', async () => {
  const home = await readHomepageSource();
  // Hero CTA: "See what I'm building" → #focus. This is the activation
  // surface on a static site (outbound click; no server-side event).
  assert.match(home, /See what I/, 'hero must declare the primary CTA');
  assert.match(home, /href="#focus"/, 'hero CTA must anchor to the focus section');
});

test('site publishes one canonical, externally corroborated person identity', async () => {
  const siteSource = await readSiteSource();
  const headSource = await readHeadSource();

  assert.match(siteSource, /personId: 'https:\/\/sarthakagrawal\.dev\/#person'/);
  assert.match(siteSource, /alternateNames: \['sarthakagrawal927', 'sarthakagrawal\.dev'\]/);
  assert.match(siteSource, /avatars\.githubusercontent\.com\/u\/43884471/);
  assert.match(siteSource, /linkedin\.com\/in\/sarthakagrawal927/);
  assert.match(siteSource, /github\.com\/sarthakagrawal927/);
  assert.match(siteSource, /x\.com\/sarthakcodes/);
  assert.match(siteSource, /huggingface\.co\/sarthakagrawal927/);
  assert.match(headSource, /'@type': 'ProfilePage'/);
  assert.match(headSource, /const personNode = \{/);
  assert.match(headSource, /'@type': 'Person'/);
  assert.match(headSource, /'@id': site\.personId/);
  assert.match(headSource, /alternateName: site\.alternateNames/);
  assert.match(headSource, /sameAs: Object\.values\(site\.profiles\)/);
  assert.match(headSource, /if \(isHome\)/);
});
