---
title: Spawning Do Not Train Registry
summary: Registry and opt-out workflow for marking works that should not be used in future AI training datasets.
status: wip
website: 'https://haveibeentrained.com/'
actionsSupported:
  - attach-preference-signal
  - rights-registry
primaryApproachType: rights-registry
pipelineStages:
  - collect
  - train
dataTypes:
  - images
tags:
  - opt-out
  - registry
evidenceLinks:
  - label: Spawning API documentation continues to describe the Do Not Train Registry
    url: 'https://site.spawning.ai/spawning-api'
    date: '2026-07-16'
  - label: Have I Been Trained site reports that it is under maintenance
    url: 'https://haveibeentrained.com/dashboard/domains'
    date: '2026-07-09'
considerations: >-
  The Have I Been Trained site is currently under maintenance, while Spawning's
  API documentation still describes access to the registry. The registry only
  works when model builders choose to honor it in dataset curation and training
  workflows. Earlier Spawning blog posts about the project are no longer
  available at their cited URLs.
visibility: public
type: data_license_initiative
---

Spawning's Do Not Train Registry is an opt-out system for creators who do not want their works included in future AI training datasets. In practice it has been closely associated with the Have I Been Trained workflow for discovering indexed works and recording training preferences.

The registry turns individual opt-outs into reusable signals, while the current public implementation appears to be in a transitional state.

Spawning Do Not Train Registry records rights, preferences, or provenance in a registry for images across the collection and training stages. It also incorporates preference signaling. Registry usefulness depends on accurate declarations, identity and rights verification, and adoption by the systems expected to consult it. Public materials describe an in-progress proposal or implementation; the newest dated source in this profile is “Spawning API documentation continues to describe the Do Not Train Registry” (July 16, 2026). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
