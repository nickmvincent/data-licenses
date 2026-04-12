---
title: Spawning Do Not Train Registry
summary: Registry and opt-out workflow for marking works that should not be used in future AI training datasets.
status: wip
website: 'https://haveibeentrained.com/'
actionsSupported:
  - attach-preference-signal
  - new-infrastructures
primaryApproachType: new-infrastructures
pipelineStages:
  - collect
  - train
dataTypes:
  - images
tags:
  - opt-out
  - registry
evidenceLinks:
  - label: Face Reveal launched for Have I Been Trained
    url: 'https://spawning.ai/blog/have-i-been-traineds-2025-face-reveal'
    date: '2025-09-15'
  - label: Project status update published
    url: 'https://spawning.ai/blog/have-i-been-traineds-project-status'
    date: '2025-08-28'
considerations: >-
  The public site is currently under maintenance, and the registry only works
  when model builders choose to honor it in dataset curation and training
  workflows.
visibility: public
type: data_license_initiative
---

Spawning's Do Not Train Registry is an opt-out system for creators who do not want their works included in future AI training datasets. In practice it has been closely associated with the Have I Been Trained workflow for discovering indexed works and recording training preferences.

The core idea is useful for this catalog because it turns an individual opt-out into a reusable registry signal, but the current public implementation appears to be in a transitional state.
