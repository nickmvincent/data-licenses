---
title: Stack Data Licensing
summary: Licensed access to Stack Overflow's developer knowledge corpus for AI training, fine-tuning, RAG, and agentic use cases.
status: live
website: 'https://stackoverflow.co/data-licensing/'
actionsSupported:
  - data-market-platform
  - attach-formal-license
primaryApproachType: data-market-platform
pipelineStages:
  - train
  - fine-tune
  - retrieve
dataTypes:
  - text
  - code
tags:
  - developer-data
  - attributed
dataVolume: '58M+ human-generated questions and answers'
metricEvidence:
  dataVolume:
    basis: explicit
    notes: The live product page now claims 83M+ questions and answers, but the conservative dated public metric I found is 58M+ from the November 2024 award announcement.
    sources:
      - label: OverflowAPI award announcement cites 58M+ questions and answers
        url: 'https://stackoverflow.co/company/press/archive/stack-overflow-overflow-api-award/'
        date: '2024-11-06'
evidenceLinks:
  - label: Product renamed from OverflowAPI to Stack Data Licensing
    url: 'https://stackoverflow.co/company/press/archive/stack-overflow-products-api-world-cloudx'
    date: '2025-09-04'
  - label: Stack Overflow joined Databricks Marketplace
    url: 'https://stackoverflow.co/company/press/archive/stack-overflow-databricks-marketplace/'
    date: '2025-06-09'
  - label: OverflowAPI won Best AI API award
    url: 'https://stackoverflow.co/company/press/archive/stack-overflow-overflow-api-award/'
    date: '2024-11-06'
considerations: Stack's offer is a centralized commercial licensing channel for its own corpus rather than a reusable standard other platforms can adopt directly.
visibility: public
type: data_license_initiative
---

Stack Data Licensing packages Stack Overflow's moderated technical corpus as a licensed input for AI systems. The public product materials explicitly position it for model training, fine-tuning, RAG, chatbots, copilots, and AI agents.

It is a strong catalog example because it combines explicit licensing, attribution framing, marketplace distribution, and a very recognizable content corpus that AI developers already value.
