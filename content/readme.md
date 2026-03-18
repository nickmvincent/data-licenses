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
- `dataTypes` for modality or content-type specificity such as `text`, `images`, `music`, or `web-content`
- `usersCount`, `dataVolume`, `moneyVolume`
- `metricEvidence`
- `implementationSnippets` for concrete examples or deployable syntax
- `considerations`, `references`, and related metadata

The `shared-references/bibtex-entries/` directory stores any citation records referenced by initiative frontmatter.

The `memos/` directory stores longer editorial writing that is rendered on the site.
