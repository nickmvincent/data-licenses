---
title: Hugging Face Gated Datasets
summary: Hub feature that requires users to request access and share identity details before downloading a dataset.
status: live
website: 'https://huggingface.co/docs/hub/datasets-gated'
actionsSupported:
  - technical-blocking
  - new-infrastructures
primaryApproachType: technical-blocking
pipelineStages:
  - collect
  - train
  - fine-tune
tags:
  - dataset-hosting
  - access-control
evidenceLinks:
  - label: Gated datasets launch explained
    url: 'https://huggingface.co/blog/unlocking-the-source-of-gated-datasets'
    date: '2022-09-30'
implementationSnippets:
  - title: Basic gated dataset card
    language: yaml
    code: |
      ---
      gated: true
      extra_gated_prompt: "You agree to not use the dataset to conduct experiments that cause harm to human subjects."
      extra_gated_fields:
        Company: text
        Country: country
      ---
    sourceUrl: 'https://huggingface.co/docs/hub/datasets-gated'
considerations: >-
  Gating governs access at the repository level rather than expressing
  standardized downstream reuse preferences once data has been obtained.
visibility: public
type: data_license_initiative
---

Hugging Face Gated Datasets let dataset publishers require access requests before files can be downloaded. Publishers can ask for contact details or additional form fields, and they can approve requests automatically or manually.

This is useful catalog coverage because it is increasingly common infrastructure for conditional dataset sharing, even though it is closer to platform access control than to interoperable web signaling.
