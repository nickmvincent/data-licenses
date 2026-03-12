---
title: DeviantArt NoAI / NoImageAI
summary: Platform-level HTML and HTTP directives that tell external AI datasets and models not to use artists' work unless they opt in.
status: live
website: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
actionsSupported:
  - attach-preference-signal
pipelineStages:
  - collect
  - train
tags:
  - art
  - meta-tag
  - x-robots-tag
  - opt-out
evidenceLinks:
  - label: DeviantArt rolls out default opt-out and publishes noai/noimageai directives
    url: 'https://www.deviantart.com/team/journal/UPDATE-All-Deviations-Are-OptedOut-of-AI-Datasets-934500371'
    date: '2022-11-11'
visibility: public
type: data_license_initiative
---

DeviantArt introduced the noai and noimageai directives to communicate that artwork is not authorized for use in third-party AI datasets unless the creator opts in. The project is notable because it paired policy defaults with concrete HTML meta tags and HTTP headers that other platforms could reuse.
