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
  - label: Have I Been Trained site reports that it is under maintenance
    url: 'https://haveibeentrained.com/'
    date: '2026-07-09'
considerations: >-
  The public site is currently under maintenance, and the registry only works
  when model builders choose to honor it in dataset curation and training
  workflows. Earlier Spawning blog posts about the project are no longer
  available at their cited URLs.
visibility: public
type: data_license_initiative
---

Spawning's Do Not Train Registry is an opt-out system for creators who do not want their works included in future AI training datasets. In practice it has been closely associated with the Have I Been Trained workflow for discovering indexed works and recording training preferences.

The registry turns individual opt-outs into reusable signals, while the current public implementation appears to be in a transitional state.
