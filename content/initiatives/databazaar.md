---
title: DataBazaar
summary: Dataset marketplace with seller-specified reuse terms, an acceptance-based default reuse grant, and account-controlled full-data access for people and AI agents.
status: live
statusRationale: Public marketplace, published MCP client, and documented public and authenticated endpoints were available when checked on October 10, 2026.
website: 'https://databazaar.io/'
actionsSupported:
  - data-market-platform
primaryApproachType: data-market-platform
pipelineStages:
  - train
  - evaluate
  - retrieve
dataTypes:
  - structured-data
  - text
tags:
  - datasets
  - agent-access
  - reuse-terms
availability: Public browsing and samples; an account is required for full dataset retrieval, including free datasets.
openSourceStatus: The MCP client is public; this does not establish that all marketplace components or listed datasets are open source.
softwareLicense: MIT for the MCP client; dataset reuse terms are separate.
considerations: Seller authority and third-party restrictions remain material. Older listings with blank reuse fields are not automatically covered by the revised default. No public adoption metric is recorded here.
evidenceLinks:
  - label: Terms of Service, including Dataset Reuse Terms, updated October 9, 2026
    url: 'https://databazaar.io/legal/terms#dataset-reuse'
    date: '2026-10-09'
    sourceType: primary
  - label: Public MCP client documentation at commit 24fb5504, including account access and listing reuse terms
    url: 'https://github.com/shagarwal/databazaar-mcp/blob/24fb5504cd2063838b579d8274fc06655b280724/README.md'
    date: '2026-10-10'
    sourceType: primary
visibility: public
type: data_license_initiative
---

DataBazaar provides a marketplace for dataset discovery and exchange through a website, REST API, and Model Context Protocol client. Its public endpoint supports searching, metadata inspection, and sample previews; full retrieval and account operations use authentication. Public sources were checked on October 10, 2026.

The October 9 terms let sellers state custom dataset reuse conditions. When a seller accepts that version and leaves both custom reuse fields blank, the stated DataBazaar Open Use default permits commercial use, modification, redistribution, and model training under rights the seller controls, without attribution. Access charges still apply. The default does not override third-party restrictions and does not automatically cover older listings without recorded acceptance.

The mechanism combines marketplace access with declared reuse permissions. It does not establish a seller's rights merely because a listing exists, or technically constrain copies after delivery. The linked materials are operator-published evidence of the offering and its stated terms, not independent evidence of adoption or effectiveness.
