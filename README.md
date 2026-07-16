# DataLicenses.org

DataLicenses.org is a public reference catalog of licenses and
license-adjacent infrastructure for controlling how data is collected, shared,
licensed, accessed, and used in AI pipelines.

## Repository structure

- `content/initiatives/` — catalog records
- `content/pages/` — public editorial pages
- `content/shared-references/` — shared citations
- `website/` — Astro static site
- `helpers/` — shared content-loading helpers

## Local development

```bash
cd website
npm install
npm run dev
```

Run the complete pre-release verification with:

```bash
cd website
npm run verify
```

## Public data

The production site publishes the catalog as versioned JSON at
`/data/initiatives.json`. Catalog data and written content are CC BY 4.0. Code
is MIT licensed.

## Contributions and security

See [CONTRIBUTING.md](CONTRIBUTING.md) for content and pull-request guidance.
Report vulnerabilities according to [SECURITY.md](SECURITY.md).

Production hosting is configured for Cloudflare Pages. Approved changes publish
from the production branch through the host's Git integration; rollback uses a
Git revert.
