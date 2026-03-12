---
title: Spawning Data Diligence
summary: Python package and API helpers for checking whether works are opted out before model training.
status: live
website: 'https://github.com/Spawning-Inc/datadiligence'
actionsSupported:
  - new-infrastructures
pipelineStages:
  - collect
  - train
  - fine-tune
tags:
  - compliance-tooling
  - opt-out
  - python
considerations: >-
  Coverage depends on which opt-out methods the tool knows about and, for some
  workflows, on access to external services maintained by Spawning.
visibility: public
type: data_license_initiative
---

Data Diligence is a developer-facing compliance tool for filtering or checking data before model training. It aims to make opt-out respect more practical by wrapping multiple signals behind a single interface for common ML workflows.

That makes it a good fit for this catalog as downstream enforcement infrastructure: it is not the signal itself, but the tooling that helps training pipelines honor those signals.
