---
title: trust.txt
summary: Publisher-oriented trust file that can also declare whether AI training is allowed through a machine-readable `datatrainingallowed=` field.
status: live
website: 'https://journallist.net/'
actionsSupported:
  - attach-preference-signal
  - new-infrastructures
primaryApproachType: attach-preference-signal
pipelineStages:
  - train
dataTypes:
  - web-content
tags:
  - publishers
  - journalism
  - trust-network
usersCount: 'about 3,000 participating publishers'
metricEvidence:
  usersCount:
    basis: explicit
    sources:
      - label: RJI described the JournalList network as about 3,000 participating publishers
        url: 'https://rjionline.org/news/trust-txt-launches-browser-extension-making-verification-of-trusted-news-sources-easier-for-publishers-and-audiences-alike/'
        date: '2025-02-21'
evidenceLinks:
  - label: Browser extension launch described the network at about 3,000 publishers
    url: 'https://rjionline.org/news/trust-txt-launches-browser-extension-making-verification-of-trusted-news-sources-easier-for-publishers-and-audiences-alike/'
    date: '2025-02-21'
  - label: trust.txt spec added the datatrainingallowed field
    url: 'https://journallist.net/reference-document-for-trust-txt-specifications'
    date: '2024-04-04'
considerations: trust.txt is publisher- and journalism-centric infrastructure; the AI-related signal is only one part of a broader trust-and-affiliation framework.
visibility: public
type: data_license_initiative
---

trust.txt is a machine-readable file used by publishers to declare affiliations and other trust metadata. In April 2024, the specification added a `datatrainingallowed=` variable, extending the framework into AI-related permissions as well.

It belongs in the catalog because it shows an existing publisher coordination system absorbing an AI-use signal rather than starting from scratch with a brand-new standard.
