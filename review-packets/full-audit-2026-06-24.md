# Full Catalog Accuracy, Link, and Freshness Audit - 2026-06-24

Method: I reviewed the 59 public initiative records in `content/initiatives/`, ran the content linter, checked every unique URL referenced by public entries, manually opened automated failures where possible, searched for recent news and standards activity, and applied one narrow accuracy correction where the catalog wording had fallen behind source status. I treated dated primary sources as stronger than live-site marketing copy, and I kept bilateral AI-content deals on the watchlist unless they point to reusable infrastructure or a cataloged initiative.

## Summary

- 59 public entries reviewed.
- 243 URL references collapsed to 177 unique URLs.
- Automated link check result: 159 OK, 13 blocked or rate-limited, 5 timed out.
- No hard dead links found in the crawl: no 404, 410, NXDOMAIN, or SSL failures.
- `npm run lint:content` and `npm run build` passed after the AIPref edit.
- One catalog accuracy fix was applied to `ai-pref`: the IETF working group remains active, but the attachment draft used by two snippets is now listed as expired.
- Recent news strengthened the market context for publisher licensing, crawler controls, and bot authentication, but most items did not justify changing catalog frontmatter.

## Entry Update Applied

- `ai-pref`: added the IETF attachment draft status as evidence, changed the HTTP header and `robots.txt` snippet summaries from active-draft language to expired-draft language, and added a consideration noting that AIPref is still active while the attachment draft is expired. Sources: [AIPref vocabulary draft](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/), [AIPref attachment draft](https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/), [AIPref working group](https://datatracker.ietf.org/wg/aipref/about/).

## Link Audit

Automated URL checking found no confirmed dead links. The non-OK URLs fall into two groups: pages that block automated validators and pages that timed out during the validator run but loaded in browser review.

| Result | Count | Treatment |
| --- | ---: | --- |
| OK | 159 | No action needed. |
| Blocked or rate-limited | 13 | Mostly publisher, press-release, or enterprise sites returning 403 to scripted checks. Manually review during future freshness passes. |
| Timeout | 5 | Browser review showed the important pages still load; keep watching in case the timeout becomes persistent. |

Blocked or rate-limited URLs worth tracking:

- `akamai-content-protector`: Akamai product, blog, and newsroom URLs returned 403 to the validator but loaded in browser review. Source checked: [Akamai Content Protector](https://www.akamai.com/products/content-protector).
- `dataseeds-ai`: AccessNewswire release returned 403 to the validator but loaded in browser review. Source checked: [DataSeeds.AI release](https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/zedges-dataseeds.ai-releases-foundational-dataset-for-computer-vi-1036758).
- `dow-jones-factiva-ai-marketplace`: Business Wire returned 403 to the validator but loaded in browser review. Source checked: [Dow Jones Factiva release](https://www.businesswire.com/news/home/20260120489743/en/Dow-Jones-Factiva-Surpasses-8000-Licensed-Sources-for-GenAI-Use).
- `prorata`: Business Wire returned 403 to the validator but loaded in browser review for the current core sources. Sources checked: [ProRata June 2025 release](https://www.businesswire.com/news/home/20250606852177/en/ProRata-AI-Signs-Partnerships-With-More-Than-500-Publications-Giving-Gist.ai-One-of-the-Largest-Licensed-Content-Libraries-in-Generative-AI-Search), [ProRata September 2025 release](https://www.businesswire.com/news/home/20250905771340/en/ProRata-Closes-%2440-Million-Series-B-Financing-and-Launches-Gist-Answers-Creating-New-Revenue-Opportunities-for-Publishers-in-the-AI-Era).
- `spur`: the Mediahuis founding-member page returned 403 to the validator but loaded in browser review. Source checked: [Mediahuis joins SPUR](https://www.mediahuis.com/en/news/mediahuis-joins-the-spur-coalition-as-founding-member).
- `shutterstock-data-licensing-ai-services`: the Shutterstock data-licensing page returned 403 to the validator but loaded in browser review. Source checked: [Shutterstock Data Licensing](https://www.shutterstock.com/data-licensing/).
- `dappier`: the marketplace URL loaded in browser review after redirecting to `https://dappier.com/marketplace/`. The newsroom launch URL still deserves a future owner-side click check because it returned 403 to the validator and was not cleanly retrievable through the browser tool. Source checked: [Dappier marketplace](https://dappier.com/marketplace/).

Timed-out URLs that loaded in browser review:

- `adobe-content-authenticity`: [Generative AI training preferences](https://helpx.adobe.com/creative-cloud/apps/adobe-content-authenticity/generative-ai-training-preferences.html).
- `shutterstock-data-licensing-ai-services`: [AI services launch](https://investor.shutterstock.com/news-releases/news-release-details/shutterstock-builds-data-licensing-strength-new-ai-services), [ChatGPT app launch](https://investor.shutterstock.com/news-releases/news-release-details/shutterstock-launches-licensed-content-app-chatgpt-bringing), and [training dataset expansion](https://www.nasdaq.com/press-release/shutterstock-announces-major-expansion-licensed-training-datasets-power-next).
- `versos-ai-video-training-data-marketplace`: [Versos AI launch](https://www.nasdaq.com/press-release/versos-ai-launches-first-end-end-solution-preparing-and-licensing-video-training-data).

## Accuracy and Freshness Findings

### Actionable Now

- `ai-pref`: corrected during this pass. The vocabulary draft is current, the working group remains active, and the attachment draft used for snippets is expired on the Datatracker. This is an accuracy correction, not a status downgrade.
- `dappier`: consider replacing or supplementing the newsroom launch URL if a site owner also sees access problems in a normal browser. The marketplace and DPA evidence still support the entry.

### Strong Evidence, No Immediate Edit

- `web-bot-auth`: the IETF working group remains active, and its chartered scope explicitly includes AI training crawlers and AI agents. Google and Cloudflare implementation docs from May 2026 still justify the current `wip` framing. Sources: [IETF Web Bot Auth](https://datatracker.ietf.org/wg/webbotauth/about/), [Google Web Bot Auth](https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth), [Cloudflare Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/).
- `dow-jones-factiva-ai-marketplace`: current evidence remains strong. Dow Jones said Factiva had rights from more than 8,000 premium sources for GenAI applications. Source: [Dow Jones Factiva release](https://www.businesswire.com/news/home/20260120489743/en/Dow-Jones-Factiva-Surpasses-8000-Licensed-Sources-for-GenAI-Use).
- `prorata`: current dated evidence remains strong. The September 2025 release supports the current 700+ participating-publication framing, while live-site claims should remain secondary unless a newer dated source appears. Source: [ProRata September 2025 release](https://www.businesswire.com/news/home/20250905771340/en/ProRata-Closes-%2440-Million-Series-B-Financing-and-Launches-Gist-Answers-Creating-New-Revenue-Opportunities-for-Publishers-in-the-AI-Era).
- `shutterstock-data-licensing-ai-services`: current evidence still supports the entry. The live data-licensing page claims a 600M+ library and 3M+ contributors, but dated frontmatter should continue to prefer the dated launch and expansion releases unless the live-page metric is explicitly labeled as accessed-date evidence. Sources: [Shutterstock Data Licensing](https://www.shutterstock.com/data-licensing/), [Shutterstock AI services launch](https://investor.shutterstock.com/news-releases/news-release-details/shutterstock-builds-data-licensing-strength-new-ai-services).
- `versos-ai-video-training-data-marketplace`: current evidence still supports the entry. The Nasdaq release says Versos works with 20+ studios and content owners and more than 1M hours of professional video content. Source: [Versos AI launch](https://www.nasdaq.com/press-release/versos-ai-launches-first-end-end-solution-preparing-and-licensing-video-training-data).

### Recent News Watchlist

- Getty Images and OpenAI reportedly signed a multi-year licensing/display agreement for Getty imagery in ChatGPT search and discovery. This is a notable AI-content licensing signal, but it looks like a bilateral deal rather than a reusable catalog initiative unless direct-deal records become in scope. Sources: [The Times](https://www.thetimes.com/us/business-us/article/getty-images-chatgpt-archive-7bt7r63zk), [Wall Street Journal live coverage](https://www.wsj.com/livecoverage/stock-market-today-dow-sp-500-nasdaq-06-22-2026/card/getty-images-stock-jumps-following-openai-partnership-J6D5bCBqHA0Lijt1yUhf).
- People Inc. criticized Google's shared crawler model for search and AI at Cannes on June 23, 2026. This is useful context for `cloudflare-anti-scraping`, `robots-ai-directives`, and the broader permission-based-access story, but it does not add a new cataloged mechanism. Source: [Axios](https://www.axios.com/2026/06/23/people-inc-google-ai-search-crawler).
- Browser vendors and Cloudflare were reported to be working on Private Access Control Tokens for distinguishing legitimate human traffic and some authorized bots. This is adjacent to `web-bot-auth` and bot access control, but it is not yet a direct replacement for the catalog's current Web Bot Auth framing. Source: [TechRadar](https://www.techradar.com/pro/web-browsers-and-cloudflare-team-up-to-authenticate-human-traffic-to-combat-the-growing-malicious-bot-hordes-and-keep-the-internet-authentic).
- Recent research on AI browsing agents and agent-first web design reinforces the need for bot identity and access-control entries, but it does not directly update a current catalog record. Sources: [FP-Agent](https://arxiv.org/abs/2605.01247), [Towards an Agent-First Web](https://arxiv.org/abs/2606.19116).

## Entry-by-Entry Status

| Entry | Audit result |
| --- | --- |
| `abc` | No accuracy issue or newer source found in this pass. |
| `adobe-content-authenticity` | Link validator timed out on the preferences page; browser review confirmed the source is live. |
| `ai-pref` | Accuracy fix applied for expired attachment draft; WG and vocabulary work remain active. |
| `ai-ready-licenses` | No accuracy issue or newer source found in this pass. |
| `ai-txt` | No accuracy issue or newer source found in this pass. |
| `akamai-content-protector` | Automated validator blocked by Akamai; browser review confirmed product and evidence pages load. |
| `amlet` | No accuracy issue or newer source found in this pass. |
| `bria-artist-program` | No accuracy issue or newer source found in this pass. |
| `cc-signals` | No accuracy issue or newer source found in this pass. |
| `ccc-ai-licensing-suite` | No accuracy issue or newer source found in this pass. |
| `cla-generative-ai-licence` | No accuracy issue or newer source found in this pass. |
| `cloudflare-anti-scraping` | Recent People Inc./Google coverage is useful context but not a direct entry update. |
| `commonsdb` | No accuracy issue or newer source found in this pass. |
| `copyrightsh` | No accuracy issue or newer source found in this pass. |
| `created-by-humans` | No accuracy issue or newer source found in this pass. |
| `credtent` | No accuracy issue or newer source found in this pass. |
| `dappier` | Marketplace is live; newsroom evidence URL needs future click-check or replacement if access problems persist. |
| `dataseeds-ai` | Automated validator blocked by AccessNewswire; browser review confirmed the release loads. |
| `dataset-providers-alliance` | No accuracy issue or newer source found in this pass. |
| `defined-ai-marketplace` | No accuracy issue or newer source found in this pass. |
| `deviantart-noai` | No accuracy issue or newer source found in this pass. |
| `do-not-train-registry` | No accuracy issue or newer source found in this pass. |
| `dow-jones-factiva-ai-marketplace` | Business Wire blocks automated checks; browser review confirmed the 8,000-source evidence. |
| `easy-dataset-share` | No accuracy issue or newer source found in this pass. |
| `european-books-data-commons` | No accuracy issue or newer source found in this pass. |
| `fairlytrained` | No accuracy issue or newer dated source found in this pass. |
| `fastly-ai-bot-management` | No accuracy issue or newer source found in this pass. |
| `flexolmo` | Related FlexMoRE research is a watch item, not a replacement for the current FlexOlmo record. |
| `gated-datasets` | No accuracy issue or newer source found in this pass. |
| `global-copyright-exchange` | No accuracy issue or newer dated source found in this pass. |
| `gloo-ai-licensing` | No accuracy issue or newer source found in this pass. |
| `human-native` | No accuracy issue or newer source found in this pass. |
| `iab-tech-lab-comp` | No accuracy issue or newer source found in this pass. |
| `iptc-plus-data-mining-metadata` | No accuracy issue or newer source found in this pass. |
| `microsoft-publisher-content-marketplace` | No accuracy issue found; keep watching for Microsoft-first updates beyond launch partners. |
| `mozilla-data-collective` | No accuracy issue or newer source found in this pass. |
| `noml` | No accuracy issue; archival framing still fits. |
| `prorata` | Business Wire blocks automated checks; browser review confirmed current evidence. |
| `protege` | No accuracy issue or newer source found in this pass. |
| `publishers-rights` | No accuracy issue or newer source found in this pass. |
| `robots-ai-directives` | Recent People Inc./Google coverage reinforces the problem space but does not change the entry. |
| `rsl` | No accuracy issue or newer source found in this pass. |
| `shutterstock-data-licensing-ai-services` | Validator timeout/403 issues only; browser review confirmed current sources and live data-licensing page. |
| `social-license-data-reuse` | No accuracy issue or newer source found in this pass. |
| `sourceaudio-ai-dataset-licensing` | No accuracy issue or newer source found in this pass. |
| `spawning-data-diligence` | No accuracy issue or newer source found in this pass. |
| `spur` | Mediahuis evidence blocks automated checks; browser review confirmed source loads. |
| `stack-data-licensing` | No accuracy issue or newer source found in this pass. |
| `syftbox` | No accuracy issue or newer source found in this pass. |
| `tdm-ai` | No accuracy issue or newer source found in this pass. |
| `tdmrep` | No accuracy issue or newer source found in this pass. |
| `tk-labels` | No accuracy issue or newer source found in this pass. |
| `tollbit` | No accuracy issue or newer source found in this pass. |
| `trust-txt` | No accuracy issue or newer source found in this pass. |
| `user-intents` | No accuracy issue or newer source found in this pass. |
| `vaisual-marketplace` | No accuracy issue; archived/conservative treatment still fits. |
| `versos-ai-video-training-data-marketplace` | Validator timeout only; browser review confirmed current evidence. |
| `web-bot-auth` | WG remains active with AI crawlers and agents in scope; current `wip` status still fits. |
| `wikimedia-enterprise` | No accuracy issue or newer source found in this pass. |

## Recommended Next Edits

- Click-test the Dappier newsroom URL in a normal owner browser. If it fails, replace or supplement it with an accessible source.
- Keep the automated link checker, but classify 403s from Business Wire, Akamai, Nasdaq, and similar sites as "needs browser confirmation" rather than dead links.
- If the catalog starts tracking direct bilateral AI licensing deals, add a separate pass for Getty/OpenAI, People Inc.'s platform deals, and similar publisher or media licensing agreements.
- Revisit AIPref after the next IETF attachment draft appears, since the current catalog examples are now explicitly marked as draft-history examples.
