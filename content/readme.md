---
type: readme
visibility: public
title: Data Licenses
---
The `initiatives/` directory stores the public catalog records consumed by the website.
Each initiative is a Markdown file with frontmatter for merge-ready fields such as:

- `title`, `summary`, `status`, `website`
- `visibility: public` and `type: data_license_initiative`
- `evidenceLinks`
- `usersCount`, `dataVolume`, `moneyVolume`
- `metricEvidence`
- `considerations`, `references`, and related metadata

The `shared-references/bibtex-entries/` directory stores any citation records referenced by initiative frontmatter.

The `memos/` directory stores longer editorial writing that is rendered on the site.
