import test from 'node:test';
import assert from 'node:assert/strict';

import {
  catalogQueryFromSearch,
  catalogUrlForQuery,
  compareCatalogRecords,
  matchesCatalogRecord,
} from '../src/lib/catalog-view.js';

const record = (overrides = {}) => ({
  title: 'Example',
  search: 'example neutral profile text',
  status: 'live',
  actions: ['protocol-standard'],
  dataTypes: ['text'],
  pipelineStages: ['train'],
  hasAdoption: false,
  latest: 100,
  featuredRank: 5,
  ...overrides,
});

const filters = (overrides = {}) => ({
  query: '',
  status: 'all',
  actions: [],
  dataTypes: [],
  pipelineStages: [],
  adoption: false,
  ...overrides,
});

test('featured sort uses editorial rank and title as a stable fallback', () => {
  const items = [
    record({ title: 'Zulu', featuredRank: 2 }),
    record({ title: 'Bravo', featuredRank: 1 }),
    record({ title: 'Alpha', featuredRank: 1 }),
  ];
  items.sort((a, b) => compareCatalogRecords(a, b, 'featured'));
  assert.deepEqual(items.map((item) => item.title), ['Alpha', 'Bravo', 'Zulu']);
});

test('alternate sorts order by title, status, and evidence date', () => {
  const items = [
    record({ title: 'Beta', status: 'wip', latest: 300 }),
    record({ title: 'Alpha', status: 'live', latest: 100 }),
  ];

  assert.deepEqual(
    [...items].sort((a, b) => compareCatalogRecords(a, b, 'alpha')).map((item) => item.title),
    ['Alpha', 'Beta']
  );
  assert.deepEqual(
    [...items].sort((a, b) => compareCatalogRecords(a, b, 'status')).map((item) => item.title),
    ['Alpha', 'Beta']
  );
  assert.deepEqual(
    [...items].sort((a, b) => compareCatalogRecords(a, b, 'latest')).map((item) => item.title),
    ['Beta', 'Alpha']
  );
});

test('search covers the supplied profile text', () => {
  assert.equal(matchesCatalogRecord(record(), filters({ query: 'neutral profile' })), true);
  assert.equal(matchesCatalogRecord(record(), filters({ query: 'website.example' })), false);
});

test('status, approach, data type, pipeline, and adoption filters compose', () => {
  const candidate = record({
    actions: ['protocol-standard', 'rights-registry'],
    dataTypes: ['text', 'images'],
    pipelineStages: ['collect', 'train'],
    hasAdoption: true,
  });

  assert.equal(
    matchesCatalogRecord(
      candidate,
      filters({
        status: 'live',
        actions: ['rights-registry'],
        dataTypes: ['images'],
        pipelineStages: ['collect'],
        adoption: true,
      })
    ),
    true
  );
  assert.equal(matchesCatalogRecord(candidate, filters({ status: 'wip' })), false);
  assert.equal(matchesCatalogRecord(candidate, filters({ actions: ['certification'] })), false);
  assert.equal(matchesCatalogRecord(candidate, filters({ dataTypes: ['audio'] })), false);
  assert.equal(matchesCatalogRecord(candidate, filters({ pipelineStages: ['generate'] })), false);
  assert.equal(matchesCatalogRecord(record(), filters({ adoption: true })), false);
});

test('catalog URL state round-trips only the search query', () => {
  const url = catalogUrlForQuery('/', 'rights registry');
  assert.equal(url, '/?q=rights+registry#catalog');
  assert.equal(catalogQueryFromSearch('?q=rights+registry&status=live'), 'rights registry');
  assert.equal(catalogUrlForQuery('/', '  '), '/#catalog');
});
