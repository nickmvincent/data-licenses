---
title: Spawning ai.txt
summary: A proposed machine-readable opt-out convention for commercial AI training via an `ai.txt` file.
status: wip
website: 'https://site.spawning.ai/spawning-ai-txt'
actionsSupported:
  - attach-preference-signal
primaryApproachType: attach-preference-signal
pipelineStages:
  - collect
  - train
  - retrieve
dataTypes:
  - web-content
evidenceLinks:
  - label: Improved crawler-control post published
    url: 'https://spawning.ai/blog/improving-ai-crawling-control-with-spawnings-little-brother-to-aiftxt'
    date: '2025-08-28'
  - label: User guide post
    url: 'https://spawning.substack.com/p/the-spawning-guide-to-rights-reservations'
    date: '2024-03-24'
considerations: >-
  An ai.txt file does not itself block access. Spawning communicates preferences
  to organizations using its API; other data miners must discover, parse, and
  choose to respect the file.
visibility: public
type: data_license_initiative
---

The `ai.txt` approach from spawning.ai introduces an optional file to express commercial text-and-data-mining preferences to AI crawlers and tools.

Spawning ai.txt publishes or proposes a machine-readable preference signal for web content across the collection, training, and retrieval stages. Site operators publish the file at a predictable location for participating tools to find. The signal communicates requested conditions; compliance depends on discovery, interpretation, and voluntary support by downstream systems. Public materials describe an in-progress proposal or implementation; the newest dated source in this profile is “Improved crawler-control post published” (August 28, 2025). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
