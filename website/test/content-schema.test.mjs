import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeInitiativeFrontmatter } from '../src/lib/content-schema.js';

const validRecord = (overrides = {}) => ({
  title: 'Example',
  summary: 'Neutral summary.',
  website: 'https://example.com/',
  status: 'live',
  visibility: 'public',
  type: 'data_license_initiative',
  actionsSupported: ['protocol-standard'],
  primaryApproachType: 'protocol-standard',
  pipelineStages: ['train'],
  dataTypes: ['text'],
  evidenceLinks: [
    {
      label: 'Launch announcement',
      url: 'https://example.com/launch',
      date: '2026-01-01',
      sourceType: 'primary',
    },
  ],
  ...overrides,
});

test('public initiatives require dated primary evidence', () => {
  assert.throws(
    () => normalizeInitiativeFrontmatter(validRecord({ evidenceLinks: [] }), 'Example'),
    /no dated evidenceLinks/
  );
  assert.throws(
    () =>
      normalizeInitiativeFrontmatter(
        validRecord({
          evidenceLinks: [
            {
              label: 'Independent report',
              url: 'https://news.example/report',
              date: '2026-01-01',
              sourceType: 'independent',
            },
          ],
        }),
        'Example'
      ),
    /no primary evidence source/
  );
});

test('archived initiatives require a reason', () => {
  assert.throws(
    () => normalizeInitiativeFrontmatter(validRecord({ status: 'archived' }), 'Example'),
    /missing archiveReason/
  );
  assert.equal(
    normalizeInitiativeFrontmatter(
      validRecord({ status: 'archived', archiveReason: 'superseded' }),
      'Example'
    ).archiveReason,
    'superseded'
  );
});

test('taxonomy fields are validated', () => {
  assert.throws(
    () =>
      normalizeInitiativeFrontmatter(
        validRecord({
          actionsSupported: ['new-infrastructures'],
          primaryApproachType: 'new-infrastructures',
        }),
        'Example'
      ),
    /invalid actionsSupported/
  );
  assert.throws(
    () => normalizeInitiativeFrontmatter(validRecord({ pipelineStages: [] }), 'Example'),
    /expected at least one stage/
  );
  assert.throws(
    () => normalizeInitiativeFrontmatter(validRecord({ dataTypes: [] }), 'Example'),
    /expected at least one data type/
  );
});
