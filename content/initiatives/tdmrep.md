---
title: TDMRep (W3C)
summary: >-
  W3C specification for expressing text and data mining permissions via a
  well-known JSON file, designed for EU DSM Directive compliance.
status: live
website: 'https://www.w3.org/community/tdmrep/'
actionsSupported:
  - attach-preference-signal
  - attach-formal-license
jurisdictions:
  - EU
dataTypes:
  - web-content
tags:
  - text-data-mining
  - dsm-directive
  - opt-out
evidenceLinks:
  - label: Version 3 final report listed
    url: 'https://www.w3.org/community/tdmrep/'
    date: '2024-08-09'
visibility: public
type: data_license_initiative
implementationSnippets:
  - title: '/.well-known/tdmrep.json'
    summary: The W3C report shows a minimal root-level reservation file for a whole site.
    language: json
    code: |
      [
        {
          "location": "/",
          "tdm-reservation": 1
        }
      ]
    sourceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/'
  - title: HTML meta tags
    summary: The same report also defines page-level HTML metadata for reservation and policy links.
    language: html
    code: |
      <meta name="tdm-reservation" content="1">
      <meta name="tdm-policy" content="https://provider.com/policies/policy.json">
    sourceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/'
---

TDMRep is a W3C Community Group specification that enables publishers to declare their text and data mining (TDM) policies through a machine-readable file at `/.well-known/tdmrep.json`. Designed specifically to support the EU DSM Directive's opt-out mechanism for commercial TDM.
