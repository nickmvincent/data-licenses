---
title: TDMRep (W3C Community Group)
summary: >-
  W3C Community Group report for expressing text and data mining rights
  reservations and policy links, designed to support the EU DSM Directive's
  Article 4 mechanism.
status: live
website: 'https://www.w3.org/community/tdmrep/'
actionsSupported:
  - attach-preference-signal
  - attach-formal-license
primaryApproachType: attach-preference-signal
jurisdictions:
  - EU
pipelineStages:
  - collect
  - train
dataTypes:
  - web-content
tags:
  - text-data-mining
  - dsm-directive
  - opt-out
evidenceLinks:
  - label: Community group notes outline 2025 alignment work with AI-Pref
    url: 'https://www.w3.org/community/tdmrep/2025/10/01/notes-september-30th-2025/'
    date: '2025-10-01'
  - label: Community group notes discuss standardization path and vocabulary work
    url: 'https://www.w3.org/community/tdmrep/2025/04/22/notes-april-15th-2025/'
    date: '2025-04-22'
  - label: Version 3 Final Community Group Report published
    url: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240510/'
    date: '2024-05-10'
considerations: >-
  This is a W3C Community Group Final Report, not a W3C Standard or a document
  on the W3C Standards Track. A reservation is a machine-readable signal, not
  technical enforcement; its legal effect depends on applicable law and the
  circumstances of use.
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
    sourceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240510/'
  - title: HTML meta tags
    summary: The same report also defines page-level HTML metadata for reservation and policy links.
    language: html
    code: |
      <meta name="tdm-reservation" content="1">
      <meta name="tdm-policy" content="https://provider.com/policies/policy.json">
    sourceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240510/'
---

The TDMRep Community Group report defines ways for rightsholders to publish machine-readable text and data mining (TDM) rights reservations and links to licensing policies, including through `/.well-known/tdmrep.json`. It was developed as a technical response to the EU DSM Directive's Article 4 mechanism for non-research TDM.

TDMRep (W3C Community Group) publishes or proposes a machine-readable preference signal for web content across the collection and training stages. It also incorporates formal licensing. The signal communicates requested conditions; compliance depends on discovery, interpretation, and voluntary support by downstream systems. Public materials describe a currently available initiative; the newest dated source in this profile is “Community group notes outline 2025 alignment work with AI-Pref” (October 1, 2025). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
