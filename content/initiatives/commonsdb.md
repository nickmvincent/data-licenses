---
title: CommonsDB
summary: Registry of signed, attributable rights declarations for public-domain and openly licensed works, linked through content-derived identifiers.
status: live
website: 'https://www.commonsdb.org/'
actionsSupported:
  - new-infrastructures
primaryApproachType: new-infrastructures
pipelineStages:
  - collect
  - train
  - retrieve
tags:
  - registry
  - public-domain
  - open-licensed
  - iscc
dataVolume: '3.5M+ declarations'
metricEvidence:
  dataVolume:
    basis: explicit
    sources:
      - label: CommonsDB dashboard reports 3.5M+ declarations
        url: 'https://www.commonsdb.org/blog/visualizing-the-registry-commonsdb-explorer-gets-a-dashboard/'
        date: '2026-06-25'
evidenceLinks:
  - label: Registry dashboard launched with 3.5M+ declarations
    url: 'https://www.commonsdb.org/blog/visualizing-the-registry-commonsdb-explorer-gets-a-dashboard/'
    date: '2026-06-25'
  - label: Feasibility study part 2 published
    url: 'https://www.commonsdb.org/blog/commonsdb-feasibility-study-part-2-from-design-to-deployment/'
    date: '2026-01-20'
  - label: Explorer launched
    url: 'https://www.commonsdb.org/blog/introducing-commonsdb-explorer/'
    date: '2025-10-31'
considerations: >-
  CommonsDB is an operational prototype with a time-bounded pilot roadmap, so
  its long-term governance and scale are still being worked out. It verifies
  declaration provenance and supplier identity, not the underlying legal status
  of a work; conflicting declarations are referred back to data suppliers.
visibility: public
type: data_license_initiative
---

CommonsDB is building public infrastructure for publishing and checking claims that digital works are in the public domain or openly licensed. It combines content-derived identifiers, signed declarations, and public APIs so that the provenance of rights information can be inspected across sources rather than trusted only on one platform.

That makes it an important adjacent layer for preference signals and AI data discovery: it is less about declaring new permissions than about making attributed rights claims easier to inspect at scale.
