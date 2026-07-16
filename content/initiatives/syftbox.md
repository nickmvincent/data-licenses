---
title: SyftBox
summary: Open-source protocol for privacy-preserving AI and analytics across distributed datasets without centralizing the underlying data.
status: live
website: 'https://openmined.org/syftbox/'
actionsSupported:
  - governed-data-sharing
primaryApproachType: governed-data-sharing
pipelineStages:
  - train
  - retrieve
dataTypes:
  - multimodal
tags:
  - privacy-preserving
  - distributed-data
evidenceLinks:
  - label: syft-flwr v0.5.1 demonstrates active federated learning workflows on SyftBox
    url: 'https://github.com/OpenMined/syft-flwr'
    date: '2026-03-28'
considerations: >-
  OpenMined labels SyftBox as beta. Its privacy and governance properties
  depend on the applications, approval workflows, and deployment configuration
  built on the protocol.
visibility: public
type: data_license_initiative
---

SyftBox is OpenMined's beta protocol layer for running computation on distributed data while keeping the source data in place. It supports AI collaboration in which data holders can retain custody and use approval and audit workflows instead of shipping raw datasets to a central buyer.

SyftBox establishes governance for data contribution, access, and computation involving multimodal material across the training and retrieval stages. Access depends on technical configuration and governance rules, including who may contribute, query, or export material. Public materials describe a currently available initiative; the newest dated source in this profile is “syft-flwr v0.5.1 demonstrates active federated learning workflows on SyftBox” (March 28, 2026). These details describe the published mechanism and evidence, not a finding about legal validity, adoption, or effectiveness.
