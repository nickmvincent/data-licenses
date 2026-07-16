---
title: Wikimedia Enterprise
summary: Enterprise-grade APIs and structured dumps for Wikipedia and sister projects, designed for large-scale reuse in AI, search, and knowledge graphs.
status: live
website: 'https://enterprise.wikimedia.com/'
actionsSupported:
  - governed-data-sharing
primaryApproachType: governed-data-sharing
pipelineStages:
  - retrieve
  - train
dataTypes:
  - text
  - structured-data
tags:
  - wikipedia
usersCount: '10+ announced partners'
dataVolume: '920+ datasets / 300M+ unique project pages'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: New enterprise partners announced
        url: 'https://enterprise.wikimedia.com/blog/wikipedia-25-enterprise-partners/'
        date: '2026-01-15'
  dataVolume:
    basis: explicit
    sources:
      - label: Current API page reports project and page coverage
        url: 'https://enterprise.wikimedia.com/api/'
        date: '2026-07-09'
evidenceLinks:
  - label: Current API page reports project and page coverage
    url: 'https://enterprise.wikimedia.com/api/'
    date: '2026-07-09'
  - label: New enterprise partners announced
    url: 'https://enterprise.wikimedia.com/blog/wikipedia-25-enterprise-partners/'
    date: '2026-01-15'
considerations: >-
  Wikimedia Enterprise is an opt-in access product layered on top of largely
  open Wikimedia content, not a general-purpose preference-signal system for
  arbitrary third-party sites.
visibility: public
type: data_license_initiative
---

Wikimedia Enterprise packages Wikipedia and related Wikimedia content for large-scale downstream reuse through structured APIs, snapshots, contracts, and support. It is explicitly positioned for AI, search, and knowledge-graph use cases that need cleaner machine-readable access than raw public dumps or scraping.

In this catalog it functions as a strong example of the "invite it in" model: not blocking AI reuse, but shaping it through better access paths, metadata, and institutional relationships.

Wikimedia Enterprise establishes governance for data contribution, access, and computation involving text and structured data across the retrieval and training stages. Access depends on technical configuration and governance rules, including who may contribute, query, or export material. Public materials describe a currently available initiative; the newest dated source in this profile is “Current API page reports project and page coverage” (July 9, 2026). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
