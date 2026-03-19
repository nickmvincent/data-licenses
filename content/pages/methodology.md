---
title: Method & Contribute
description: How the catalog is reviewed, what belongs here, and how to contribute.
visibility: public
---

DataLicenses.org is a community-curated catalog. The idea is that folks interested in this topic can submit content. Currently there is no formal governance process, as this is at the "very small" stage (practically, the main editor is Nick Vincent with feedback from a small group of interested parties). Down the line, we'll add formal governance process to decide what belongs here, how entries are written, and which caveats stay visible.

The first draft of this site was built with heavy assistance from coding agents for both web design and information retrieval. The main risks of AI usage in this kind of project are (1) incorrect information (thus, we must maintain human review of all initiatives and all pieces of "evidence"), (2) unpleasant "AI slop tone" in any writing that makes readers have a bad experience, and (3) bad web design. At present, there should not be any major security concerns.

## How we collect initiatives

Our goal is to use search tools, presence in relevant spaces (e.g., going to conferences, watching online spaces), and social networks to maintain a catalog of any "data licensing" relevant initiatives. At the end of the day, people decide what belongs in the catalog, how entries are written, and which caveats stay visible. AI can help find sources and draft updates. Important claims should point to public sources that a reviewer can open and check.

Right now inititives are stored in markdown files in the GitHub repo. This may change (perhaps moving to ATProto approach to further externalize content).

### Workflow

1. You spot a new initiative or a possible update.
2. Read the current entry first.
3. Check the strongest public sources first: official sites, docs, changelogs, repos, and filings.
4. If helpful, use AI to gather links or draft a small update packet as a single markdown file (see current examples here https://github.com/nickmvincent/data-licenses/tree/main/content/initiatives for exact schema)
5. Review the key claims
6. If the evidence is weak or unclear, say so or leave it out (that's ok!)
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

## Contribute

- Suggest a new initiative or update an existing one with a canonical site and dated sources.
- Open an issue for leads, scope questions, or early discussion.
- If in doubt, for now, just open an issue!
- Open a pull request when the wording and metadata are ready to review.
- Every suggested `evidenceLinks`, `usersCount`, `dataVolume`, or `moneyVolume` value should include a clickable source and date. If you add a metric, add matching `metricEvidence`.

Developers can add or update a markdown file under `content/initiatives/`. Each entry should have one canonical `website`, a `status` of `live` or `wip`, `visibility: public`, `type: data_license_initiative`, and optional dated `evidenceLinks`.