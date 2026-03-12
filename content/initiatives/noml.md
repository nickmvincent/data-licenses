---
title: NoML
summary: Proposal to add a `noml` directive so content can stay searchable but not be used for machine learning.
status: wip
website: 'https://noml.info/'
actionsSupported:
  - attach-preference-signal
pipelineStages:
  - collect
  - train
signals:
  - noml
tags:
  - robots-meta
  - x-robots-tag
  - search
  - machine-learning
implementationSnippets:
  - title: HTML meta tag
    language: html
    code: |
      <meta name="robots" content="noml">
    sourceUrl: 'https://noml.info/'
  - title: HTTP header
    language: http
    code: |
      X-Robots-Tag: noml
    sourceUrl: 'https://noml.info/'
considerations: >-
  NoML is a proposal rather than a broadly adopted standard, and it depends on
  voluntary compliance by crawlers, search engines, and downstream API users.
visibility: public
type: data_license_initiative
---

NoML proposes a simple extension to existing robots-style signaling: a `noml` value that can be added to HTML meta tags or `X-Robots-Tag` headers. The goal is to let publishers keep content discoverable in search while separately asking that it not be used for machine learning.

It is intentionally lightweight and easy to deploy, but it remains an advocacy proposal rather than a settled web standard.
