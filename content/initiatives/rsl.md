---
title: Really Simple Licensing (RSL)
summary: >-
  A machine-readable licensing schema for clearly signaling reuse permissions
  and conditions (including payment or use restriction).
status: live
website: 'https://rslstandard.org/'
actionsSupported:
  - attach-formal-license
  - attach-preference-signal
primaryApproachType: attach-formal-license
dataTypes:
  - web-content
usersCount: '1,500+ endorsing organizations'
dataVolume: 'supporters represent billions of web pages'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: RSL reports endorsement by 1,500+ organizations
        url: 'https://rslstandard.org/press/rsl-1-specification-2025'
        date: '2025-12-10'
  dataVolume:
    basis: explicit
    sources:
      - label: RSL reports the web reach represented by supporters
        url: 'https://rslstandard.org/press/rsl-1-specification-2025'
        date: '2025-12-10'
evidenceLinks:
  - label: Technical standards released
    url: 'https://rslstandard.org/press/rsl-1-specification-2025'
    date: '2025-12-10'
  - label: RSL Standard and Collective launched
    url: 'https://rslstandard.org/press/rsl-standard'
    date: '2025-09-10'
implementationSnippets:
  - title: Site-wide RSL file
    summary: The RSL 1.0 spec includes a compact XML example for prohibiting AI use across a site.
    language: xml
    code: |
      <rsl xmlns="https://rslstandard.org/rsl">
        <content url="/">
          <license>
            <prohibits type="usage">ai-all</prohibits>
          </license>
        </content>
      </rsl>
    sourceUrl: 'https://rslstandard.org/rsl'
  - title: Schema.org license pointer
    summary: RSL's Schema.org guide shows how structured metadata on a page can point to an RSL license file.
    language: json
    code: |
      {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": "Moby Dick; Or, The Whale by Herman Melville",
        "author": {
          "@type": "Person",
          "name": "Herman Melville"
        },
        "license": "https://gutenberg.org/ebooks-rsl-license.xml"
      }
    sourceUrl: 'https://rslstandard.org/guide/schema-org'
considerations: >-
  The reported organization and page figures describe endorsement and the
  reach represented by supporters, not verified RSL deployment. RSL expresses
  terms and rights reservations but does not itself block access, compel
  crawler compliance, or establish enforceability in every jurisdiction.
visibility: public
type: data_license_initiative
---

RSL provides a structured way to express licensing terms in machine-readable form for clients that choose to support it. The standard combines rights expression, implementation guidance, and ecosystem backing from publishers and infrastructure providers.
