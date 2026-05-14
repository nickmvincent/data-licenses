# Usage and Taxonomy Pass - 2026-05-14

Method: I reviewed every current initiative entry against the local catalog, then searched official pages, docs, press pages, standards trackers, and recent coverage for newer public adoption evidence. I only changed entry frontmatter when the source was dated and strong enough to support a catalog claim. Ambiguous usage claims are listed here for review instead of being merged into metrics.

## Entry Updates Applied

- `ai-pref`: updated latest evidence to `draft-ietf-aipref-vocab-06` (`2026-04-27`). The work is active standards development, not deployed usage.
- `cc-signals`: refreshed to "Creative Commons Signals", pointed the canonical website at the CC project page, added `new-infrastructures` as a secondary action, and added the April/May 2026 CC updates that reframe the work from narrow preference signaling toward governance and infrastructure.
- `cla-generative-ai-licence`: added the March 2026 PLS first-stage opt-in launch for the CLA / PLS / ALCS collective AI licensing scheme.
- `cloudflare-anti-scraping`: added Cloudflare's `2026-04-17` Redirects for AI Training update as newer product evidence.
- `iptc-plus-data-mining-metadata`: added IPTC's `2026-03-30` version 2.0 AI opt-out guidance.
- `sourceaudio-ai-dataset-licensing`: updated catalog and revenue metrics to `3,000+ music catalogs`, `14M+ opted-in songs`, and `nearly $10M annual revenue from eight contracts`, based on the February 2026 Symphonic partnership press release.
- `spur`: updated from five to six founding publisher members after Mediahuis joined on `2026-05-11`.
- `stack-data-licensing`: updated corpus size from `58M+` to `83M+ human-verified questions and answers`, using the current official product page captured on `2026-05-14`.

## Strongest Public Usage Signals

These are not directly comparable units, so this is a qualitative ranking by scale, deployment evidence, and relevance to AI data access.

| Rank | Entry | Current public usage signal | Read |
| --- | --- | --- | --- |
| 1 | `cloudflare-anti-scraping` | `3.8M+` managed `robots.txt` domains and `1B+` daily 402 responses. This is the clearest internet-scale deployment signal. | [Content Signals Policy](https://blog.cloudflare.com/content-signals-policy/), [AI Crawl Control GA](https://blog.cloudflare.com/introducing-ai-crawl-control/) |
| 2 | `rsl` | `1,500+` organizations and support spanning billions of pages. Strong standards plus ecosystem signal. | [RSL 1.0 release](https://rslstandard.org/press/rsl-1-specification-2025) |
| 3 | `tollbit` | Current catalog keeps `4,000+` premium publishers. Newer sources report `3,000+` publishers/websites with `1.5B` quarterly bot scrapes and interviews cite nearly `7,000` publisher sites. This should be reconciled before changing the metric. | [Akamai alliance](https://www.akamai.com/newsroom/press-release/no-free-crawls-akamai-tollbit-and-skyfire-turn-traffic-into-revenue), [Digiday Arc XP integration](https://digiday.com/media/the-washington-posts-arc-xp-adds-tollbit-to-help-publishers-make-money-from-ai-bot-traffic/) |
| 4 | `trust-txt` | About `3,000` JournalList participating publishers. Strong publisher-network signal, but the AI-specific field is only one part of the trust.txt system. | [RJI update](https://rjionline.org/news/trust-txt-launches-browser-extension-making-verification-of-trusted-news-sources-easier-for-publishers-and-audiences-alike/) |
| 5 | `sourceaudio-ai-dataset-licensing` | `3,000+` music catalogs, `14M+` opted-in songs, and nearly `$10M` annual revenue from eight AI licensing contracts. | [Symphonic press release](https://www.recordoftheday.com/news-and-press/sourceaudio-inks-deal-with-symphonic-expanding-ethical-ai-licensing-opportunities-for-artists) |
| 6 | `stack-data-licensing` | `83M+` human-verified Q&A across `69,000+` topics. Very large corpus, but customer/adoption count remains private. | [Stack Data Licensing](https://stackoverflow.co/data-licensing/) |
| 7 | `wikimedia-enterprise` | Named partners now include Amazon, Meta, Microsoft, Mistral AI, Perplexity, Google, Ecosia, Nomic, Pleias, ProRata, and Reef Media; Wikipedia also supplies a very large live knowledge corpus. | [Wikimedia Enterprise partners](https://enterprise.wikimedia.com/blog/wikipedia-25-enterprise-partners/) |
| 8 | `commonsdb` | `300,000+` registry declarations from project partners in an operational prototype. | [CommonsDB feasibility study part 2](https://www.commonsdb.org/blog/commonsdb-feasibility-study-part-2-from-design-to-deployment/) |
| 9 | `prorata` | `700+` participating publications in the current dated evidence trail. | [ProRata / Gist launch](https://www.businesswire.com/news/home/20250905771340/en/ProRata-Closes-%2440-Million-Series-B-Financing-and-Launches-Gist-Answers-Creating-New-Revenue-Opportunities-for-Publishers-in-the-AI-Era) |
| 10 | `defined-ai-marketplace` / `protege` / `mozilla-data-collective` | These show credible marketplace or dataset scale, but public metrics are either revenue-growth, partner-level, or observed page counts rather than clean adoption counts. | [Defined.ai 2025 growth](https://defined.ai/press-room/defined-ai-reports-sixty-five-percent-revenue-growth), [Protege HC1 partnership](https://withprotege.ai/news/hc1-data-partnership-healthcare), [Mozilla Data Collective](https://data.mozilla.org/) |

## Claims To Hold For Review

- `tollbit`: there is enough public evidence to say usage is larger than the current `4,000+` metric, but the sources use different units: official site copy says `1,400+ publisher sites`, Akamai says `3,000+ publishers and websites`, and 2026 interviews/coverage cite nearly `7,000 publisher sites`. I left the frontmatter unchanged and updated the curation note.
- `fairlytrained`: the live certified-models surface appears larger than the current conservative rollup, but I still did not find a clean dated count to replace `16+`.
- `prorata`: the live product surface and market reports suggest continued growth, but the `700+` publication count remains the cleanest dated metric I found.
- `gated-datasets`: likely very large in practice, but Hugging Face docs do not publish a platform-level gated-dataset count.
- `adobe-content-authenticity`, `iptc-plus-data-mining-metadata`, `tdmrep`, `tdm-ai`, `ai-pref`, and `cc-signals`: standards or metadata layers may be important without producing direct usage counts.

## Taxonomy Notes

- Keep the eight current primary approach categories for now. They are legible on the homepage and cover the catalog without forcing a large migration.
- Add optional facets before adding new top-level categories. The most useful facets would be `deploymentLayer` (`domain`, `asset`, `registry`, `marketplace`, `edge`, `collective`, `certification`) and `adoptionUnit` (`domains`, `publishers`, `catalogs`, `datasets`, `declarations`, `contracts`, `revenue`, `traffic`).
- Rename `add-tollgate` if we are willing to touch UI copy. `Metered access` or `Monetized access control` would describe Cloudflare, TollBit, and Dappier more cleanly than "tollgate".
- `new-infrastructures` is becoming the catch-all bucket. If it keeps growing, split it into `rights-registry` and `bot-identity-access` or keep the current category and add tags for those subtypes.
- `attach-preference-signal` covers too much: robots/domain signals, embedded asset metadata, content-usage vocabularies, and legal rights-reservation notices. I would keep it as the primary category but add tags such as `domain-signal`, `asset-signal`, `rights-reservation`, and `content-usage-vocabulary`.
- Do not add a new `provenance` top-level category yet. If C2PA / CAWG Training and Data Mining Assertion becomes a standalone catalog entry, then revisit this; for now `content-credentials` and `metadata` tags are enough.
- Keep `certification` despite the low count. Fairly Trained is meaningfully different from preference signals and marketplaces.

## Possible Future Entries

- `C2PA / CAWG Training and Data Mining Assertion`: likely worth a separate editorial decision if the catalog wants standards-level provenance and data-mining assertions, not only Adobe's implementation.
- `KnectIQ + VeridatAI custody-free data exchange`: recent May 2026 announcement, but it needs more evidence before it belongs in the catalog.
- `Dow Jones / Factiva AI marketplace`: still high-profile, but I did not find a clean first-party launch page in this pass.

## Merge Judgment

At the time of this research pass, the current branch was fast-forwardable relative to `origin/main`: `origin/main` was an ancestor of `HEAD`, and the branch was two commits ahead. The release should still be reviewed, linted, committed, and merged through the normal branch workflow.
