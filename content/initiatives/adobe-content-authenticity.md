---
title: Adobe Content Authenticity
summary: Content Credentials-based preference system for asking supported generative AI models not to train on or use a creator's files.
status: live
website: 'https://helpx.adobe.com/creative-cloud/apps/adobe-content-authenticity/generative-ai-training-preferences.html'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - train
  - generate
dataTypes:
  - images
  - video
tags:
  - content-credentials
  - metadata
evidenceLinks:
  - label: Generative AI training and usage preference documentation
    url: 'https://helpx.adobe.com/creative-cloud/apps/adobe-content-authenticity/generative-ai-training-preferences.html'
    date: '2025-09-02'
  - label: Public beta launch for Adobe Content Authenticity
    url: 'https://blog.adobe.com/en/publish/2025/04/24/adobe-content-authenticity-now-public-beta-helps-creators-secure-attribution'
    date: '2025-04-24'
considerations: >-
  Adobe currently documents support in Adobe Firefly. Outside supported Adobe
  workflows, the preference is metadata signaling rather than technical
  enforcement, and recognition depends on other model providers.
visibility: public
type: data_license_initiative
---

Adobe Content Authenticity lets creators attach Content Credentials that carry a generative AI training and usage preference with the file itself. Unlike crawler directives, this is an asset-level signal embedded in media and paired with identity and attribution metadata.
