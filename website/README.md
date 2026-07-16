# DataLicenses.org website

This Astro project builds the static DataLicenses.org reference site from the
repository's Markdown content.

## Important paths

- `src/lib/content-schema.js` — runtime content validation
- `src/lib/content-loader.ts` — public content loader and derived metadata
- `src/lib/catalog.ts` — public labels and classification details
- `src/lib/catalog-view.js` — tested catalog filtering and sorting logic
- `src/components/CatalogExplorer.astro` — progressive-enhancement catalog UI
- `src/pages/data/initiatives.json.ts` — versioned public JSON dataset
- `scripts/lint-content.mjs` — content lint
- `scripts/check-built-site.mjs` — generated-site checks

## Catalog behavior

- All current rows are rendered in HTML and readable without JavaScript.
- Search covers title, summary, and profile body.
- Filters cover status, approach, data type, pipeline stage, and adoption
  evidence.
- The default order is editorially featured; A–Z, status, and latest-evidence
  sorts are optional.
- One table is the default layout; grouping by primary approach is optional.
- Only the search query is written to the URL.
- Archived initiatives appear on a dedicated archive page.

## Content model

Public initiative records require a title, neutral summary, website, status,
approach, primary approach, pipeline stage, data type, and profile body.
Archived records require an archive reason.

Approach values are:

- `attach-preference-signal`
- `attach-formal-license`
- `join-licensing-collective`
- `data-market-platform`
- `add-tollgate`
- `technical-blocking`
- `rights-registry`
- `protocol-standard`
- `governed-data-sharing`
- `certification`

Pipeline stages are `collect`, `train`, `fine-tune`, `evaluate`, `retrieve`,
and `generate`.

## Commands

- `npm run dev` — local development
- `npm run lint:content` — validate catalog content
- `npm run check` — Astro type check
- `npm test` — unit tests
- `npm run build` — production build
- `npm run verify` — complete pre-release checks
- `npm run export:xlsx` — spreadsheet export

## Hosting

`wrangler.toml` configures the static output for Cloudflare Pages. Production
deployments should use the Pages Git integration so approved merges publish
automatically. Do not bypass the verification checks.
