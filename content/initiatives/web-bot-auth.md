---
title: IETF Web Bot Auth
summary: Working group standardizing cryptographic authentication for bots and AI agents on the web.
status: wip
website: 'https://datatracker.ietf.org/wg/webbotauth/about/'
actionsSupported:
  - new-infrastructures
primaryApproachType: new-infrastructures
pipelineStages:
  - collect
  - retrieve
dataTypes:
  - web-content
tags:
  - bot-authentication
evidenceLinks:
  - label: Cloudflare documents Web Bot Auth verification support
    url: 'https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/'
    date: '2026-05-05'
  - label: Google documents experimental Web Bot Auth support
    url: 'https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth'
    date: '2026-05-04'
  - label: Use cases draft updated
    url: 'https://datatracker.ietf.org/doc/draft-nottingham-webbotauth-use-cases/02/'
    date: '2026-04-01'
  - label: Charter approved
    url: 'https://datatracker.ietf.org/group/webbotauth/history/'
    date: '2025-10-23'
considerations: >-
  Web Bot Auth focuses on authenticated bot identity and operator metadata, not
  on expressing reuse permissions; it is complementary to preference-signal
  efforts such as AIPref.
visibility: public
type: data_license_initiative
---

The IETF Web Bot Auth working group is developing standards for cryptographically authenticating automated clients and conveying more information about their operators to websites. That matters for data-licensing and AI-governance workflows because stronger bot identity can make differentiated access rules, rate limits, and policy enforcement more reliable.

The group is still in an active standardization phase, with chartered work on authentication techniques, bot metadata, and operational guidance. Google and Cloudflare now publish implementation guidance for experimental or provider-specific Web Bot Auth handling, which makes the standardization work visible in early operational docs.
