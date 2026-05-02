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

Current initiative statuses are:

- `live` for public initiatives that are usable now
- `wip` for efforts still emerging
- `archived` for historical or dormant entries that remain accessible but are hidden from the default catalog view

The `memos/` directory stores longer editorial notes kept in the repo. These are not currently routed on the public site.
