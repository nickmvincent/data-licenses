---
title: easy-dataset-share
summary: >-
  A simple anti-scraping tool intended to protect datasets from basic
  crawlers/scrapers.
status: live
website: 'https://github.com/Responsible-Dataset-Sharing/easy-dataset-share'
actionsSupported:
  - technical-blocking
primaryApproachType: technical-blocking
pipelineStages:
  - collect
dataTypes:
  - multimodal
tags:
  - dataset-protection
dependsOn:
  - cloudflare-anti-scraping
evidenceLinks:
  - label: easy-dataset-share v0.5.0 released
    url: 'https://github.com/Responsible-Dataset-Sharing/easy-dataset-share/releases/tag/v0.5.0'
    date: '2025-09-15'
  - label: Project launch post published
    url: 'https://www.lesswrong.com/posts/DA3vbSEfABLdoCt59/we-built-a-tool-to-protect-your-dataset-from-simple-scrapers'
    date: '2025-09-13'
visibility: public
type: data_license_initiative
---

Reference post: https://www.lesswrong.com/posts/DA3vbSEfABLdoCt59/we-built-a-tool-to-protect-your-dataset-from-simple-scrapers

Notes
- Early-stage writeup about protecting datasets from basic scraping approaches.
- Tracking here for awareness; details and maturity may change as the work evolves.

easy-dataset-share uses technical controls to restrict or challenge automated collection of multimodal material at the collection stage. Access controls can limit collection from protected infrastructure but may be bypassed and do not govern downstream use after access. Public materials describe a currently available initiative; the newest dated source in this profile is “easy-dataset-share v0.5.0 released” (September 15, 2025). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
