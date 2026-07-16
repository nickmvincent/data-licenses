---
title: Methodology
description: How the catalog is scoped, sourced, maintained, and reviewed, including its current use of AI agents.
visibility: public
---

DataLicenses.org is a public reference catalog of licenses and license-adjacent infrastructure for controlling how data is collected, shared, licensed, accessed, and used in AI pipelines. It reports public claims and evidence; inclusion is not endorsement, legal advice, procurement advice, or proof that an initiative works.

## Current stewardship and use of AI agents

The current workflow is one maintainer working heavily with AI agents. Nick Vincent maintains the catalog and has final editorial responsibility. The project is not yet community-maintained or independently reviewed at scale.

Much of the present research, drafting, data entry, consistency checking, and site maintenance is done by Nick with extensive assistance from AI agents. Agents help identify candidates, locate and compare sources, extract structured fields, draft and revise profiles, check links and schemas, and modify site code.

Nick makes final publication, classification, and correction decisions. That human approval is not the same as independent verification by multiple reviewers, and it does not eliminate errors introduced by agents or inherited from sources. Readers should use the linked evidence and review dates to assess a claim rather than relying on the catalog’s authority alone.

The project aims for substantially more human involvement in subject-matter review, source checking, corrections, governance, and shared maintenance. Public issues and pull requests are the current path toward that model. Until participation broadens, this remains primarily a one-person project that uses agents heavily.

## Scope and unit of analysis

The catalog covers concrete, publicly documented mechanisms that express, negotiate, or enforce conditions on data use. These include preference signals, formal licenses, licensing collectives, marketplaces, tollgates, technical blocking, rights registries, protocols and standards, governed data sharing, and certification. Research proposals are included when they define a specific mechanism.

The catalog excludes commentary without a concrete initiative, undocumented private offerings, general AI governance, litigation trackers, unverified announcements, tools focused only on model outputs, and complete withholding or data-poisoning approaches without a licensing, preference, market, or controlled-access mechanism.

One record represents one initiative that can be understood and sourced independently. Related efforts are combined when they share an operator, mechanism, documentation, and lifecycle; they are separated when their terms, technical behavior, operators, evidence, or status materially differ.

Coverage is intended to be global, but it is uneven. Public documentation, discoverability, language access, maintainer capacity, and agent performance all affect what is found and how quickly it is reviewed.

## Classification

Each initiative has one primary approach and may have secondary approaches. The primary label identifies the mechanism most central to how it operates. Definitions are available in the [glossary](/glossary).

Status means:

- **Live:** publicly available or deployable at the latest review.
- **In progress:** publicly documented but still emerging or not fully deployed.
- **Archived:** retained for historical context after discontinuation, replacement, dormancy, loss of scope, or an unresolved status review.

“Live” does not mean widely adopted, legally tested, or effective. Pipeline-stage and data-type labels describe documented scope and may overlap. Classification always involves editorial judgment.

## Evidence and profile requirements

A public record needs a canonical public page and dated evidence supporting its inclusion or status. Sources may include official documentation, repositories, announcements, filings, changelogs, partner or customer statements, credible independent reporting, archived pages, official social posts, and attributable talks or recordings.

Evidence is labeled as a **primary source**, **partner or customer source**, or **independent source**. Primary sources are preferred for an initiative’s existence, features, and current status. Independent sources are useful for context, conflicts, corrections, adoption, and third-party claims.

A public profile includes a neutral summary, canonical website, status and rationale, a short explanation, at least one pipeline stage and data type, and a last-checked date. Optional fields include operator, launch date, geography, pricing, source availability, rights contacts, integrations, adoption, and successor information. Missing information is not inferred.

Numeric adoption claims require a matching public source. Simple arithmetic from explicit figures may be labeled as derived; marketing language is not converted into a number.

“Latest tracked evidence” is the newest dated source recorded on a profile. “Last checked” is when the profile’s public sources were last reviewed. Neither date guarantees that the record is complete or current.

## Review, corrections, and archiving

The review target for current profiles is at least once every three months. With one maintainer, that target may not always be met; each profile displays its last-checked date so readers can judge freshness directly.

Corrections, acquisitions, discontinuations, replacements, and material new sources can trigger an earlier review. Evidence of discontinuation or a successor can move a record to the archive. Lack of recent evidence may also lead to archiving after reasonable public-source checks.

When credible sources conflict, the profile should state the conflict rather than present a disputed claim as settled. Corrections update the profile and its evidence trail. Material disputes are handled through a public GitHub issue unless privacy, security, or legal concerns require limiting sensitive details.

Initiative owners are welcome to submit evidence and corrections, but they do not have pre-publication approval rights. Urgent privacy, security, or rights concerns receive expedited review, and content may be temporarily removed while a credible high-risk concern is assessed.

## Accountability and participation

Repository history records editorial and code changes. Contributors must disclose material financial, employment, advisory, or organizational relationships with an initiative they propose or edit. Paid placement, sponsored rankings, and affiliate links are not accepted.

More human participation is especially valuable for source verification, regional and language coverage, domain expertise, disputed classifications, and periodic review. Open a GitHub issue for a lead, correction, dispute, or scope question, or open a pull request for a source-backed record or wording change. See the [contribution page](/contributing) for the available forms and review workflow.
