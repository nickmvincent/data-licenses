# datalicenses.org

This Astro site renders the public catalog for DataLicenses.org from the shared content in the repo root.

## Project structure

Key paths:
- `src/lib/content-schema.js` — Shared runtime validation rules for the loader and linter
- `../content/initiatives/*.md` — Main dataset
- `../content/shared-references/bibtex-entries/*.md` — Optional bibliography records used by `references`
- `src/data/initiative-curation.json` — Editorial tracking for evidence/adoption research backlog
- `src/lib/content-loader.ts` — Runtime content loader and derived fields
- `src/pages/index.astro` — Homepage and single public browsing surface
- `src/components/CatalogExplorer.astro` — Search, task presets, filters, and comparison UI
- `src/pages/catalog.astro` — Compatibility redirect to the homepage catalog
- `src/pages/methodology.astro` — Combined methodology and contributing guide
- `src/pages/contributing.astro` — Compatibility page pointing to the merged guide
- `src/pages/data/initiatives.json.ts` — Full catalog JSON endpoint
- `src/pages/data/curation.json.ts` — Curation/backlog JSON endpoint
- `scripts/lint-content.mjs` — Content linter

## Initiative schema

Required frontmatter:
- `title`: string
- `summary`: string
- `status`: `live` | `wip`
- `website`: URL
- `visibility`: `public` | `private` | `draft`
- `type`: `data_license_initiative`

Common optional fields:
- `actionsSupported`: array of `attach-preference-signal`, `attach-formal-license`, `join-licensing-collective`, `data-market-platform`, `add-tollgate`, `technical-blocking`, `new-infrastructures`, `certification`
- `evidenceLinks`: array of `{ label, url, date }`
- `jurisdictions`, `signals`, `pipelineStages`, `tags`, `dependsOn`
- `usersCount`, `dataVolume`, `moneyVolume`
- `metricEvidence`: per-metric attribution matching any populated adoption metric
- `considerations`
- `implementationSnippets` (optional `summary`, `exampleUrl`, and `exampleLabel` supported for online examples)
- `references`: citation keys from `../content/shared-references/bibtex-entries`

Example:

```md
---
title: Example Initiative
summary: One-line neutral summary.
status: live
website: https://example.org/
visibility: public
type: data_license_initiative
evidenceLinks:
  - label: Partner program announced
    url: https://example.org/blog/partners
    date: 2026-01-15
usersCount: "10+ announced partners"
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: Partner program announced
        url: https://example.org/blog/partners
        date: 2026-01-15
considerations: Partner count comes from the launch post and may understate current uptake.
---
```

## Evidence workflow

- The catalog's "Latest update" is the newest dated `evidenceLinks` entry.
- Prefer primary sources: official sites, docs, repos, changelogs, announcements, filings, and product pages.
- Use top-level `usersCount`, `dataVolume`, and `moneyVolume` only when a public source states or clearly supports the metric.
- When a metric is present, add matching `metricEvidence`.
- `metricEvidence.basis: derived` is only for simple, reviewable rollups across public sources.
- Keep caveats in `considerations` instead of hiding uncertainty.

`src/data/initiative-curation.json` tracks editorial backlog state:
- `adoptionResearchStatus`: `populated` | `needs-research` | `hard-to-quantify`
- `adoptionResearchNotes`: short rationale

## Catalog behavior

The catalog on the homepage supports:
- Free-text search over title, summary, tags, website, approach text, data and pipeline types, and evidence labels
- Goal presets for access control, terms, licensing, and governed data sourcing
- Approach, data-type, pipeline-stage, status, archive, adoption-evidence, and implementation-example filters
- Sorting by latest public update, alphabetically, or public status
- Side-by-side comparison of two or three initiatives
- URL-backed filter state via `q`, `status`, `goal`, repeated `actions`, `types`, `stages`, `has`, `sort`, and `archived`

## JSON endpoints

`/data/initiatives.json`
- Response: `{ count, items }`
- Includes initiative frontmatter plus derived fields such as `slug`, `latestUpdate`, `evidenceStatus`, and resolved references

`/data/curation.json`
- Response: `{ count, summary, items }`
- Includes derived sourcing/adoption status fields for editorial triage

## Validation

Run:
- `npm run lint:content`
- `npm run build`
- `npm run check`

The content linter validates required fields, evidence/metric structure, placeholder text, shared-reference integrity, and a few weak-evidence patterns.

## Development

Commands:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check`
- `npm run export:xlsx`

`npm run export:xlsx` writes `dist/data-licenses-catalog.xlsx`, with worksheet tabs for the main initiative catalog plus supporting evidence, references, implementation snippets, and longer-form site content. Pass a custom output path with `npm run export:xlsx -- ./dist/custom-name.xlsx`.

## Deploying to Cloudflare Pages

This repo includes a `wrangler.toml` configured for Pages.

1. Authenticate once: `npx wrangler login`
2. Build the static assets: `npm run build`
3. Deploy to your Pages project: `npm run cf:deploy`
4. Optional: test locally with `npx wrangler pages dev dist`
