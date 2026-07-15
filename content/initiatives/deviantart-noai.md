---
title: DeviantArt NoAI / NoImageAI
summary: Platform NoAI label that emits HTML and HTTP signals stating artwork is not authorized for third-party AI-training datasets.
status: live
website: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - collect
  - train
dataTypes:
  - images
tags:
  - x-robots-tag
  - opt-out
evidenceLinks:
  - label: Current help documentation explains the NoAI setting
    url: 'https://www.deviantartsupport.com/kb/en/article/how-do-i-change-the-noai-setting-on-my-deviations'
    date: '2026-07-09'
  - label: New DeviantArt Studio supports NoAI label presets
    url: 'https://www.deviantart.com/team/journal/Submit-and-manage-your-art-from-the-new-Studio-1031764662'
    date: '2024-04-17'
  - label: DeviantArt rolls out default opt-out and publishes noai/noimageai directives
    url: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
    date: '2022-11-11'
implementationSnippets:
  - title: HTML robots meta tags
    summary: DeviantArt's team announcement publishes these exact page-level directives for opted-out artwork.
    language: html
    code: |
      <meta name="robots" content="noimageai">
      <meta name="robots" content="noai">
    sourceUrl: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
  - title: HTTP response headers
    summary: The same announcement says DeviantArt sends these directives when the image file is downloaded directly.
    language: http
    code: |
      X-Robots-Tag: noimageai
      X-Robots-Tag: noai
    sourceUrl: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
considerations: >-
  The directives communicate that a work is not authorized for third-party AI
  training, but they do not technically block collection or demonstrate
  downstream compliance. External actors must recognize them, although
  DeviantArt's terms require third parties using DeviantArt-sourced content to
  exclude labeled works.
visibility: public
type: data_license_initiative
---

DeviantArt introduced the noai and noimageai directives to communicate that artwork is not authorized for use in third-party AI-training datasets unless the creator opts in. The project is notable because it paired policy defaults with concrete HTML meta tags and HTTP headers that other platforms could reuse.
