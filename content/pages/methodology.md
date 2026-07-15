---
title: Methodology
description: How the catalog is scoped, sourced, reviewed, and updated.
visibility: public
---

DataLicenses.org is a community-curated catalog of public initiatives shaping AI data access, licensing, controlled retrieval, and enforcement. The catalog is currently maintained by Nick Vincent with feedback from a small group of contributors and subject-matter observers.

The field is still emerging. Inclusion in the catalog does not mean that an initiative is widely adopted, legally validated, technically effective, or suitable for a particular use. Many preference signals depend on voluntary compliance. Technical controls can reduce access without preventing every collection route or governing downstream copies. Licenses and contract terms depend on the relevant rights, notice, agreement, jurisdiction, and facts. The catalog describes public claims and evidence; it does not provide legal advice or certify effectiveness.

The project is still lightweight, so editorial decisions are made through public issues, pull requests, and direct review rather than a formal governance board. As the catalog grows, the review process should become more explicit about inclusion criteria, writing standards, and how disagreements are resolved.

AI tools may be used to help find sources, compare public materials, draft update packets, and improve code. They do not replace human review. Claims, dates, adoption metrics, and descriptions should be checked against public sources before they are merged.

## How we collect initiatives

The catalog is maintained through a mix of source review, conference and community monitoring, public announcements, standards work, and contributor submissions. Entries are included when they have a clear relationship to AI data rights or AI-relevant data access.

Initiatives are stored as markdown records in the GitHub repository. Each record should have a canonical website, a short summary, a status, a primary mechanism, and dated evidence links for meaningful public updates.

### Workflow

1. You spot a new initiative or a possible update.
2. Read the current entry first.
3. Check the strongest public sources first: official sites, docs, changelogs, repos, and filings.
4. If helpful, use AI to gather links or draft a small update packet as a single markdown file. Existing entries in the repository show the current schema.
5. Review the key claims.
6. If evidence is weak, conflicting, or indirect, note the uncertainty or leave the claim out.
7. A person makes the final merge.

### Good update

- A short factual summary.
- At least one public source.
- Exact dates when timing matters.
- A clear note on any uncertainty or limits.

If AI is involved, the best output is usually a small review packet with sources, a draft summary, and notes on anything unclear.

### Quick Checklist

- Make sure it has a clear AI data rights angle.
- Include one canonical website and at least one dated public source for any factual update.
- Keep summaries short, neutral, and specific.
- If you add a metric, add matching `metricEvidence` too.

### In scope

- Initiatives that shape AI data flows through preference signals, licenses or terms, collectives, marketplaces, technical controls, certification, or new infrastructure.
- Concrete implementation details, canonical websites, and dated evidence links.
- Metadata like status, pipeline stage, data type, jurisdiction, and adoption signals.

### Status meanings

- `live`: publicly available or deployable now. This does not mean widely adopted, legally tested, or proven effective.
- `wip`: publicly documented but still under review, emerging, or not yet fully deployed.
- `archived`: kept for historical context, but hidden from the default catalog view because a review did not find newer public activity.

Status tracks public availability, not enforcement strength. Each initiative profile separately describes the mechanism's practical force and its most important limitation.

The practical-force label is an editorial classification based on the initiative's primary approach. It is a starting point for comparison, not a legal conclusion or a substitute for the initiative's current terms and technical documentation.

## Contribute

- Suggest a new initiative or update an existing one with a canonical site and dated sources.
- Open an issue for leads, scope questions, or early discussion.
- Open an issue if you are unsure whether something belongs in scope.
- Open a pull request when the wording and metadata are ready to review.
- Every suggested `evidenceLinks`, `usersCount`, `dataVolume`, or `moneyVolume` value should include a clickable source and date. If you add a metric, add matching `metricEvidence`.

Developers can add or update a markdown file under `content/initiatives/`. Each entry should have one canonical `website`, a `status` of `live`, `wip`, or `archived`, `visibility: public`, `type: data_license_initiative`, and optional dated `evidenceLinks`.
