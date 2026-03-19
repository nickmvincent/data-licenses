---
title: Method & Contribute
description: How the catalog is reviewed, what belongs here, and how to contribute.
visibility: public
---

DataLicenses.org is a human-curated catalog. People decide what belongs here, how entries are written, and which caveats stay visible. AI can help with research, but people review and publish.

## Method

### Principles

- **Human-curated.** People decide what belongs in the catalog, how entries are written, and which caveats stay visible.
- **AI can assist.** AI can help find sources and draft updates, but people review every claim and publish the final version.
- **Show the evidence.** Important claims should point to public sources that a reviewer can open and check.

### Workflow

1. A person spots a new initiative or a possible update.
2. Read the current entry first.
3. Check the strongest public sources first: official sites, docs, changelogs, repos, and filings.
4. If helpful, use AI to gather links or draft a small update packet.
5. Review every claim by hand.
6. If the evidence is weak or unclear, say so or leave it out.
7. A person makes the final merge.

### Good Update

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

### In Scope

- Initiatives that shape AI data flows through preference signals, licenses or terms, collectives, marketplaces, technical controls, certification, or new infrastructure.
- Concrete implementation details, canonical websites, and dated evidence links.
- Metadata like status, pipeline stage, data type, jurisdiction, and adoption signals.

### Out of Scope

- General anti-AI security work without a data rights angle.
- Pure research without a public artifact or path to use.
- Provenance-only work unless it directly affects licensing or preferences.

## Contribute

- Suggest a new initiative or update an existing one with a canonical site and dated sources.
- Open an issue for leads, scope questions, or early discussion.
- Open a pull request when the wording and metadata are ready to review.
- Every suggested `evidenceLinks`, `usersCount`, `dataVolume`, or `moneyVolume` value should include a clickable source and date. If you add a metric, add matching `metricEvidence`.

Developers can add or update a markdown file under `content/initiatives/`. Each entry should have one canonical `website`, a `status` of `live` or `wip`, `visibility: public`, `type: data_license_initiative`, and optional dated `evidenceLinks`.

## Research Inputs

- Start from the public [research prompt](/prompts/find-updates.txt), the current [catalog JSON](/data/initiatives.json), and the curation backlog at [`/data/curation.json`](/data/curation.json).
- Prefer primary sources: official sites, docs, repos, changelogs, announcements, and filings.
- If evidence is partial or ambiguous, keep the caveat in the entry.
