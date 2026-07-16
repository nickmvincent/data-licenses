---
title: Spawning Data Diligence
summary: Python package and API helpers for checking whether works are opted out before model training.
status: live
website: 'https://github.com/Spawning-Inc/datadiligence'
actionsSupported:
  - protocol-standard
primaryApproachType: protocol-standard
pipelineStages:
  - collect
  - train
  - fine-tune
dataTypes:
  - multimodal
tags:
  - compliance-tooling
  - opt-out
evidenceLinks:
  - label: PyPI package remains available at version 0.1.7
    url: 'https://pypi.org/project/datadiligence/'
    date: '2026-07-16'
considerations: >-
  The documented checks cover the Spawning API, DeviantArt X-Robots-Tag
  headers, and C2PA/CAI metadata. The package neither blocks access nor
  guarantees complete opt-out coverage or legal compliance; some workflows
  also depend on services maintained by Spawning.
visibility: public
type: data_license_initiative
---

Data Diligence is a developer-facing compliance tool for filtering or checking data before model training. It aims to make opt-out respect more practical by wrapping multiple signals behind a single interface for common ML workflows.

That makes it a good fit for this catalog as downstream compliance-support tooling: it is not the signal itself, but a library that training pipelines can use when deciding whether to include a work.

Spawning Data Diligence defines a shared protocol or technical standard for multimodal material across the collection, training, and fine-tuning stages. The protocol coordinates participating systems; practical coverage depends on implementation, interoperability, and adoption. Public materials describe a currently available initiative; the newest dated source in this profile is “PyPI package remains available at version 0.1.7” (July 16, 2026). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
