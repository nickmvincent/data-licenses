---
title: NoML
summary: 2023 robots-style proposal for limiting machine-learning use, with no newer public development found in the 2026 freshness review.
status: archived
archiveReason: dormant
website: 'https://noml.info/'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - collect
  - train
dataTypes:
  - web-content
signals:
  - noml
tags:
  - robots-meta
  - x-robots-tag
evidenceLinks:
  - label: Mojeek publishes NoML proposal and open letter
    url: 'https://blog.mojeek.com/2023/10/noml-proposal-and-open-letter.html'
    date: '2023-10-25'
implementationSnippets:
  - title: HTML meta tag
    summary: NoML proposes this as the simplest page-level signal for HTML documents.
    language: html
    code: |
      <meta name="robots" content="noml">
    sourceUrl: 'https://noml.info/'
  - title: HTTP header
    summary: For non-HTML responses, the proposal uses the parallel X-Robots-Tag form.
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

NoML publishes or proposes a machine-readable preference signal for web content across the collection and training stages. The signal communicates requested conditions; compliance depends on discovery, interpretation, and voluntary support by downstream systems. The initiative is archived as dormant; the newest dated source in this profile is “Mojeek publishes NoML proposal and open letter” (October 25, 2023). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
