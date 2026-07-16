---
title: Cloudflare AI Crawl Control
summary: >-
  Live controls for classifying and blocking Search, Agent, and Training bots,
  alongside managed preference signals and monetization tools.
status: live
website: 'https://blog.cloudflare.com/control-content-use-for-ai-training/'
tags:
  - bot-management
actionsSupported:
  - technical-blocking
  - add-tollgate
  - attach-preference-signal
primaryApproachType: add-tollgate
pipelineStages:
  - collect
  - retrieve
dataTypes:
  - web-content
usersCount: '3.8M+ domains on managed robots.txt'
dataVolume: '1B+ HTTP 402 responses/day across Cloudflare customers'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: Content Signals Policy launched
        url: 'https://blog.cloudflare.com/content-signals-policy/'
        date: '2025-09-24'
  dataVolume:
    basis: explicit
    notes: The company-wide figure is not specific to AI Crawl Control or paid crawling.
    sources:
      - label: AI Crawl Control general availability announced
        url: 'https://blog.cloudflare.com/introducing-ai-crawl-control/'
        date: '2025-08-28'
evidenceLinks:
  - label: Search, Agent, and Training bot controls launched
    url: 'https://blog.cloudflare.com/content-independence-day-ai-options/'
    date: '2026-07-01'
  - label: Redirects for AI Training launched
    url: 'https://blog.cloudflare.com/ai-redirects/'
    date: '2026-04-17'
  - label: Content Signals Policy launched
    url: 'https://blog.cloudflare.com/content-signals-policy/'
    date: '2025-09-24'
  - label: AI Crawl Control general availability announced
    url: 'https://blog.cloudflare.com/introducing-ai-crawl-control/'
    date: '2025-08-28'
  - label: AI Audit and marketplace features launched
    url: 'https://blog.cloudflare.com/control-content-use-for-ai-training/'
    date: '2025-07-01'
implementationSnippets:
  - title: Real-world robots.txt blocklist
    summary: Cloudflare's Robotcop post uses this abbreviated news-site policy as a concrete AI crawler blocklist example.
    language: text
    code: |
      User-agent: GPTBot
      Disallow: /

      User-agent: ChatGPT-User
      Disallow: /

      User-agent: anthropic-ai
      Disallow: /

      User-agent: Google-Extended
      Disallow: /

      User-agent: Bytespider
      Disallow: /
    sourceUrl: 'https://blog.cloudflare.com/ai-audit-enforcing-robots-txt/'
  - title: Managed Content Signals example
    summary: Cloudflare's July 2026 update adds a reference-use preference to its managed robots.txt signal.
    language: text
    code: |
      User-Agent: *
      Content-Signal: search=yes, ai-train=no, use=reference
      Allow: /
    sourceUrl: 'https://blog.cloudflare.com/content-independence-day-ai-options/'
considerations: >-
  Cloudflare's robots.txt Content Signals express preferences and do not issue
  blocks directly. Its edge security rules can block traffic that Cloudflare
  classifies as automated, while the effectiveness of preference signals still
  depends on crawler behavior.
visibility: public
type: data_license_initiative
---

Cloudflare's controls distinguish Search, Agent, and Training traffic and let site owners apply edge blocking by use case. Its dashboard and BotBase provide visibility into known bots, managed robots.txt publishes Content Signals, redirects can steer verified training crawlers toward canonical content, and Pay Per Crawl supports monetized automated access.

Cloudflare AI Crawl Control conditions automated access through authentication, payment, or rate controls for web content across the collection and retrieval stages. It also incorporates technical blocking and preference signaling. The mechanism controls a protected access route; it does not determine how acquired material is used or whether alternate routes remain available. Public materials describe a currently available initiative; the newest dated source in this profile is “Search, Agent, and Training bot controls launched” (July 1, 2026). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
