---
title: TDM·AI
summary: Asset-level protocol for binding machine-readable TDM and AI-training preferences to digital works.
status: wip
website: 'https://tdmai.org/'
actionsSupported:
  - attach-preference-signal
  - new-infrastructures
primaryApproachType: attach-preference-signal
jurisdictions:
  - EU
pipelineStages:
  - collect
  - train
  - fine-tune
dataTypes:
  - multimodal
signals:
  - all
  - train-ai
  - train-genai
  - ai-use
  - search
tags:
  - tdm
  - iscc
  - verifiable-credentials
dependsOn:
  - ai-pref
evidenceLinks:
  - label: Usage vocabulary updated
    url: 'https://docs.tdmai.org/technical-specification/usage-preferences-vocabulary'
    date: '2025-11-04'
considerations: >-
  The protocol is aligned to evolving IETF AI Preferences drafts and may change
  as those drafts mature.
visibility: public
type: data_license_initiative
---

TDM·AI is a protocol for attaching machine-readable text-and-data-mining and AI-training preferences to individual digital assets rather than to whole domains. It uses content-derived identifiers and verifiable credentials so declarations can remain tied to a work even when files move between platforms or lose embedded metadata.

The project is especially relevant where domain-level tools like robots.txt are too coarse, but it is still emerging and closely coupled to draft-stage vocabulary work elsewhere in the standards ecosystem.
