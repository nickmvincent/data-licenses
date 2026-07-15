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
primaryApproachType: attach-preference-signal
status: wip
evidenceLinks:
  - label: Vocabulary draft 06 updated
    url: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/'
    date: '2026-04-27'
  - label: Attachment draft listed as expired
    url: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/'
    date: '2026-05-01'
  - label: Protocol milestones moved to August 2026
    url: 'https://datatracker.ietf.org/wg/aipref/history/'
    date: '2025-09-23'
implementationSnippets:
  - title: HTTP response header draft example
    summary: The expired attachment draft showed AI preferences delivered directly in the HTTP response.
    language: http
    code: |
      HTTP/1.1 200 OK
      Content-Type: text/plain
      Content-Usage: train-ai=n
    sourceUrl: 'https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/'
  - title: robots.txt draft example
    summary: The expired attachment draft also sketched a domain-level robots.txt expression.
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
considerations: >-
  The AIPref working group remains active, but the attachment draft referenced
  by the HTTP header and robots.txt examples is currently expired on the IETF
  Datatracker. Treat those snippets as draft-history examples until newer
  attachment work replaces them. The working-group charter explicitly excludes
  technical enforcement: AIPref communicates preferences and does not itself
  block access or compel compliance.
visibility: public
type: data_license_initiative
---

The AIPref effort investigates a standardized way to express preferences to AI systems, including crawlers and agents. The working group is still active, with current vocabulary work and an expired attachment draft in its public record. No production deployment signal is available yet.
