---
title: User Intents
summary: Proposed AT Protocol mechanism for users to declare data-reuse preferences such as generative-AI training.
status: wip
website: 'https://demo.user-intents.org/'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - collect
  - train
  - retrieve
signals:
  - org.user-intents.syntheticContentGeneration
tags:
  - atproto
dependsOn:
  - ai-pref
evidenceLinks:
  - label: Proposal discussion opened
    url: 'https://github.com/bluesky-social/atproto/discussions/3617'
    date: '2025-03-08'
implementationSnippets:
  - title: Declaration record example
    summary: The atproto proposal discussion includes a concrete account-level declaration record with AI generation disallowed.
    language: json
    code: |
      {
        "$type": "org.user-intents.declaration",
        "updatedAt": "2025-02-20T21:37:20.362Z",
        "org.user-intents.syntheticContentGeneration": {
          "allow": false,
          "updatedAt": "2025-02-20T21:37:20.362Z"
        }
      }
    sourceUrl: 'https://github.com/bluesky-social/atproto/discussions/3617'
  - title: HTTP header mapped from the declaration
    summary: The public demo says these declarations can be translated into a Content-Usage header on web profile pages.
    language: http
    code: |
      Content-Usage: train-ai=n
    sourceUrl: 'https://demo.user-intents.org/'
    exampleUrl: 'https://demo.user-intents.org/'
    exampleLabel: 'Demo'
considerations: >-
  This is still a proposal plus demo implementation, and its enforcement model
  is voluntary in the same sense as other preference-signal approaches.
visibility: public
type: data_license_initiative
---

User Intents is an AT Protocol proposal for letting people declare how their public social data may be reused, including for generative-AI training. A public demo already maps these declarations to draft AIPref-style HTTP signaling for web access.

The work is notable because it moves preference signaling from site operators toward end users, but it is still early and not yet a standardized, network-wide default.
