---
title: IPTC + PLUS Data Mining Metadata
summary: Embedded image and video metadata fields for expressing whether assets may be used in data-mining and generative-AI training datasets.
status: live
website: 'https://pluscoalition.org/about-ai-and-ml-image-rights-standards/'
actionsSupported:
  - attach-preference-signal
pipelineStages:
  - collect
  - train
  - fine-tune
dataTypes:
  - images
  - video
tags:
  - metadata
  - images
  - video
  - iptc
  - plus
evidenceLinks:
  - label: IPTC and PLUS explain metadata stance on GenAI training
    url: 'https://iptc.org/news/iptc-and-plus-response-to-the-us-copyright-offices-notice-of-inquiry-on-genai-training/'
    date: '2025-02-20'
considerations: Asset-level metadata only works when intermediaries preserve it, and public adoption is harder to measure than crawler-level signals.
visibility: public
type: data_license_initiative
---

IPTC and the PLUS Coalition have added machine-readable data-mining permission fields to major image and video metadata standards so rights holders can say whether works may be used in training datasets. This belongs in the catalog because it pushes AI-use controls down to the asset level, which is complementary to site-level approaches like robots.txt or domain-level preference headers.
