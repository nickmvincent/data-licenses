---
title: IPTC + PLUS Data Mining Metadata
summary: Embedded image and video metadata fields for expressing whether assets may be used in data-mining and generative-AI training datasets.
status: live
website: 'https://ns.useplus.org/LDF/ldf-XMPSpecification#DataMining'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - collect
  - train
  - fine-tune
dataTypes:
  - images
  - video
tags:
  - metadata
evidenceLinks:
  - label: IPTC publishes version 2.0 of AI opt-out guidelines
    url: 'https://iptc.org/news/iptc-publishes-v2-0-of-ai-opt-out-guidlines/'
    date: '2026-03-30'
  - label: IPTC and PLUS submit response to US National Science Foundation AI Action Plan
    url: 'https://iptc.org/news/iptc-and-plus-submit-response-to-us-ai-action-plan/'
    date: '2025-03-14'
  - label: IPTC and PLUS finalize Data Mining field in Photo Metadata Standard 2023.1
    url: 'https://iptc.org/news/exclude-images-from-generative-ai-iptc-photo-metadata-standard-2023-1/'
    date: '2023-10-12'
implementationSnippets:
  - title: ExifTool write command
    summary: IPTC shows this command as a concrete way to attach a PLUS Data Mining value to a video file.
    language: bash
    code: |
      exiftool -XMP-plus:DataMining="Prohibited for Generative AI/ML training" example-video.mp4
    sourceUrl: 'https://iptc.org/news/videos-can-be-opted-out-from-ai-indexing-using-iptc-video-metadata-hub-version-1-5/'
  - title: Embedded metadata field
    summary: The same IPTC guidance uses this Data Mining value for a generative-AI opt-out.
    language: text
    code: |
      XMP-plus:DataMining = "Prohibited for Generative AI/ML training"
    sourceUrl: 'https://iptc.org/news/videos-can-be-opted-out-from-ai-indexing-using-iptc-video-metadata-hub-version-1-5/'
considerations: Asset-level metadata only works when intermediaries preserve it, and public adoption is harder to measure than crawler-level signals.
visibility: public
type: data_license_initiative
---

IPTC and the PLUS Coalition have added machine-readable data-mining permission fields to major image and video metadata standards so rights holders can say whether works may be used in training datasets. Those fields push AI-use controls down to the asset level, complementing site-level approaches like robots.txt or domain-level preference headers.
