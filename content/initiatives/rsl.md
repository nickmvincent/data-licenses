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
usersCount: '1,500+ organizations'
dataVolume: 'billions of web pages'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: Technical standards released
        url: 'https://rslstandard.org/press/rsl-1-specification-2025'
        date: '2025-12-10'
  dataVolume:
    basis: explicit
    sources:
      - label: Technical standards released
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
        "@context": "https://schema.org/",
        "@type": "Book",
        "license": "https://rslstandard.org/rsl"
      }
    sourceUrl: 'https://rslstandard.org/guide/schema-org'
visibility: public
type: data_license_initiative
---

RSL proposes a structured way to express licensing terms in machine-readable form so implementers can reliably interpret reuse permissions across the web. The standard combines rights expression, implementation guidance, and ecosystem backing from publishers and infrastructure providers.
