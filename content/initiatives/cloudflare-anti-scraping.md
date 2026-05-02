---
title: Cloudflare AI Crawl Control
summary: >-
  A set of tools to block or charge for scraping; includes AI Audit dashboard,
  managed robots.txt, and pay-per-crawl marketplace.
status: live
website: 'https://blog.cloudflare.com/control-content-use-for-ai-training/'
tags:
  - bot-management
actionsSupported:
  - technical-blocking
  - add-tollgate
  - attach-preference-signal
primaryApproachType: add-tollgate
dataTypes:
  - web-content
usersCount: '3.8M+ domains on managed robots.txt'
dataVolume: '1B+ 402 responses/day'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: Content Signals Policy launched
        url: 'https://blog.cloudflare.com/content-signals-policy/'
        date: '2025-09-24'
  dataVolume:
    basis: explicit
    sources:
      - label: AI Crawl Control general availability announced
        url: 'https://blog.cloudflare.com/introducing-ai-crawl-control/'
        date: '2025-08-28'
evidenceLinks:
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
  - title: Content Signals robots.txt example
    summary: Cloudflare's Content Signals post shows how a site can allow search while disallowing AI training in robots.txt.
    language: text
    code: |
      User-Agent: *
      Content-Signal: search=yes, ai-train=no
      Allow: /
    sourceUrl: 'https://blog.cloudflare.com/content-signals-policy/'
visibility: public
type: data_license_initiative
---

Cloudflare's AI Crawl Control offers multiple tools: AI Audit dashboard shows which bots crawl your site, managed robots.txt simplifies blocking, and a pay-per-crawl marketplace lets publishers monetize AI training access.
