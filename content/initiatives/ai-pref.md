---
title: IETF AI Preferences (AIPref)
summary: >-
  Internet Engineering Task Force is working on a standardized preference signal
  for AI agents and crawlers ("building blocks that allow for the expression of
  preferences about how content is collected and processed for Artificial
  Intelligence (AI) model development, deployment, and use.")
website: 'https://datatracker.ietf.org/wg/aipref/about/'
actionsSupported:
  - attach-preference-signal
status: wip
evidenceLinks:
  - label: Vocabulary draft updated
    url: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/'
    date: '2025-12-01'
  - label: Milestone for protocol specifications
    url: 'https://datatracker.ietf.org/wg/aipref/about/'
    date: '2025-08-01'
implementationSnippets:
  - title: HTTP response header draft example
    summary: Active AIPref attachment work shows AI preferences delivered directly in the HTTP response.
    language: http
    code: |
      HTTP/1.1 200 OK
      Content-Type: text/plain
      Content-Usage: train-ai=n
    sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/'
  - title: robots.txt draft example
    summary: The same attachment draft also sketches a domain-level robots.txt expression.
    language: text
    code: |
      User-agent: *
      Allow: /
      Content-Usage: train-ai=n
    sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/'
  - title: HTML meta-tag draft example
    summary: Earlier vocabulary work also explored per-page HTML metadata for finer-grained preferences.
    language: html
    code: |
      <meta name="AI-PREF" content="allow_training=false; retention_period=0">
    sourceUrl: 'https://datatracker.ietf.org/doc/html/draft-vaughan-aipref-vocab-00'
visibility: public
type: data_license_initiative
---

The AIPref effort investigates a standardized way to express preferences to AI systems (including crawlers and agents). It is in early discussion and not ready for production use.
