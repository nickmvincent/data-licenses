---
title: DIY robots handling (robots.txt++)
summary: >-
  robots.txt and HTTP crawler directives can express AI crawler preferences,
  including disallow rules, per-response X-Robots-Tag headers, and newer
  Content Signals for search, AI input, and AI training, plus an experimental
  content-use extension.
status: live
website: 'https://developers.openai.com/api/docs/bots'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
dataTypes:
  - web-content
evidenceLinks:
  - label: Google documents user-triggered fetcher handling
    url: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers'
    date: '2026-05-08'
  - label: Cloudflare documents managed robots.txt content signals
    url: 'https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/'
    date: '2026-07-01'
  - label: OpenAI bots documentation
    url: 'https://developers.openai.com/api/docs/bots'
    date: '2025-09-17'
visibility: public
type: data_license_initiative
---

Websites can use `robots.txt` and related directives to communicate whether AI crawlers may access content. OpenAI, Google, Cloudflare, and other operators document crawler-specific handling, but compliance depends on the crawler and use case.

`X-Robots-Tag` sends crawler directives through HTTP response headers, which supports URL-level or response-level handling beyond a sitewide `robots.txt` file.

Cloudflare's managed `robots.txt` setting adds known AI crawler disallow rules and Content Signals such as `search`, `ai-input`, and `ai-train`. Cloudflare is also testing a separate `content-use` extension for describing how accessed content may be stored or reused. The file expresses preferences; it does not block requests by itself.

Google's user-triggered fetcher documentation notes that some user-initiated fetches generally ignore `robots.txt`, including AI-agent fetches under `Google-Agent`. That keeps robots-style controls useful but incomplete for AI access governance.
