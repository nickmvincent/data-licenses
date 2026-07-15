# Minimalism And Freshness Pass - 2026-07-01

Method: I made a design pass focused on reducing visible UI layers, ran the content linter, checked all public catalog URLs with a network-enabled automated sweep, reviewed stale rows, and verified the strongest missing-entry candidates against current public sources.

## Design Changes Applied

- Consolidated the homepage and catalog into one searchable, sortable browsing surface with optional comparison.
- Organized the default view around user goals while keeping detailed filters available on demand.
- Flattened the related-project footer into compact reference links.
- Kept evidence links, source dates, status, metrics, and enforcement caveats visible in the results.

## Link Check

- 184 unique public URLs checked.
- 165 returned OK.
- 13 returned automated 403-style blocking.
- 6 timed out under the scripted checker.
- No confirmed 404, 410, DNS, or SSL failures were found.

Blocked or timed-out URLs are concentrated in the same families noted in the 2026-06-24 audit: Business Wire, Akamai, AccessNewswire, Dappier, Mediahuis, Shutterstock, Nasdaq, and Adobe HelpX. Treat these as browser-confirmation targets, not confirmed dead links.

## Entries Added

- `troveo`: added as a `data-market-platform` entry. The April 28, 2026 expansion release reports more than $20 million paid to content owners and licensed datasets across video, audio, text, enterprise workflows, gaming, and robotics. Source: [Troveo expansion release](https://www.streetinsider.com/Business%2BWire/Troveo%2BAccelerates%2BAI%2BModel%2BDevelopment%2C%2BExpands%2BAI%2BTraining%2BData%2BPlatform%2Bto%2BFive%2BNew%2BCategories%2C%2BAnnounces%2B%2420%2BMillion%2Bin%2BPayouts/26379730.html).
- `veritone-data-marketplace`: added as a `data-market-platform` entry. The March 10, 2026 launch release describes a governed marketplace for rightsholders and accredited AI developers, with rights tracking and delivery pipelines. Source: [Veritone Data Marketplace launch](https://www.nasdaq.com/press-release/veritone-transforms-ai-supply-chain-launch-veritone-data-marketplace-delivering).
- `news-media-alliance-ai-licensing-program`: added as a `join-licensing-collective` entry. The live program page lists opt-in AI licensing opportunities with Bria and ProRata for NMA publishers. Source: [NMA AI Licensing Program](https://www.newsmediaalliance.org/news-media-alliance-ai-licensing-program/).

## Cleanup Decisions

- `human-native` was archived because Cloudflare acquired the company and the marketplace is no longer independently available.
- `vaisual-marketplace` was restored to live after verifying that Dataset Shop remains available and currently lists image and video datasets.
- `humpback` remains draft-only and outside the public catalog until dated evidence improves.
- `noml` remains archived.
- `spawning-data-diligence`, `tk-labels`, `deviantart-noai`, `fairlytrained`, and `dataset-providers-alliance` are older or quiet, but still have live source surfaces or ongoing relevance; keep them public for now.

## News Watch

- Recent reporting says Google is pushing publishers toward AI-related licensing or partnership terms tied to AI Overviews and existing Showcase payments. This is important market context, but it does not yet map cleanly to a reusable catalog initiative beyond existing crawler/licensing entries. Source: [New York Post, 2026-06-26](https://nypost.com/2026/06/26/business/google-looks-to-bleed-publishers-with-new-ai-partnerships-that-would-cull-their-content/).
- News litigation continued to expand in late June 2026, including independent publishers suing OpenAI and Microsoft. This reinforces demand for licensing infrastructure but is litigation context rather than a catalog item.
