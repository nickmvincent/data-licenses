---
type: readme
visibility: public
title: Data Licenses content
---

The `initiatives/` directory stores catalog records consumed by the public
website and JSON dataset.

Required publication fields include:

- `title`, `summary`, `website`, and `status`
- `visibility: public` and `type: data_license_initiative`
- `actionsSupported` and `primaryApproachType`
- at least one `pipelineStages` value and one `dataTypes` value
- a profile body

Current statuses are `live`, `wip`, and `archived`. Archived records also
require `archiveReason`.

Evidence belongs in dated `evidenceLinks`. Adoption, money, and data-volume
figures require matching `metricEvidence`. Useful optional fields include
operator, launch date, availability, pricing, open-source status, software
license, rights contact, integrations, status rationale, successor,
considerations, implementation snippets, and shared references.

The `shared-references/bibtex-entries/` directory stores citation records
referenced by initiative frontmatter.
