#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYaml } from 'js-yaml';
import {
  ADOPTION_METRIC_FIELDS,
  ADOPTION_RESEARCH_STATUSES,
  normalizeEvidenceLinks,
  normalizeImplementationSnippets,
  normalizeMetricEvidence,
  normalizeStringArray,
  normalizeUrl,
  looksLikeRootHomepage,
  parseStatus,
  parseVisibility,
  requireInitiativeType,
  requireString,
  requireUrlString,
  stripContextFromMessage,
} from '../src/lib/content-schema.js';

const dir = join(process.cwd(), '..', 'content', 'initiatives');
const sharedRefsDir = join(process.cwd(), '..', 'content', 'shared-references', 'bibtex-entries');
const curationPath = join(process.cwd(), 'src', 'data', 'initiative-curation.json');
const allowedAdoptionResearchStatuses = new Set(ADOPTION_RESEARCH_STATUSES);
let sharedRefsAvailable = false;

function extractFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function collectIssue(list, context, fn) {
  try {
    return fn();
  } catch (error) {
    list.push(stripContextFromMessage(error, context));
    return undefined;
  }
}

let errors = 0;
let warnings = 0;
const seenSlugs = new Set();
let curationData = {};

// Load available reference keys once
const availableRefs = new Set();
try {
  if (existsSync(sharedRefsDir)) {
    sharedRefsAvailable = true;
    for (const file of readdirSync(sharedRefsDir).filter((f) => f.endsWith('.md'))) {
      const raw = readFileSync(join(sharedRefsDir, file), 'utf8');
      const fm = extractFrontmatter(raw);
      if (!fm) continue;
      const parsed = loadYaml(fm) || {};
      if (parsed.citation_key) {
        availableRefs.add(String(parsed.citation_key));
      }
    }
  }
} catch (err) {
  console.warn(`WARN: could not load shared references from ${sharedRefsDir}: ${err.message || err}`);
}

try {
  if (existsSync(curationPath)) {
    curationData = JSON.parse(readFileSync(curationPath, 'utf8'));
  } else {
    console.warn(`WARN: could not find curation file at ${curationPath}`);
  }
} catch (err) {
  console.warn(`WARN: could not load curation data from ${curationPath}: ${err.message || err}`);
}

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const p = join(dir, file);
  const txt = readFileSync(p, 'utf8');
  const fm = extractFrontmatter(txt);
  let parsedFm = {};
  try {
    parsedFm = fm ? loadYaml(fm) || {} : {};
  } catch (error) {
    console.error(`ERROR content/initiatives/${file}: invalid frontmatter YAML: ${error.message || error}`);
    errors += 1;
    continue;
  }

  const slug = file.replace(/\.md$/, '');
  seenSlugs.add(slug);
  const issues = [];
  const warns = [];
  const context = `Initiative ${file}`;

  collectIssue(issues, context, () => requireString(parsedFm.title, 'title', context));
  collectIssue(issues, context, () => requireString(parsedFm.summary, 'summary', context));
  collectIssue(issues, context, () => parseStatus(parsedFm.status, context));
  collectIssue(issues, context, () => requireUrlString(parsedFm.website, 'website', context));
  collectIssue(issues, context, () => parseVisibility(parsedFm.visibility, context));
  collectIssue(issues, context, () => requireInitiativeType(parsedFm.type, context));
  collectIssue(issues, context, () =>
    normalizeStringArray(parsedFm.actionsSupported, 'actionsSupported', context)
  );
  collectIssue(issues, context, () =>
    normalizeStringArray(parsedFm.jurisdictions, 'jurisdictions', context)
  );
  collectIssue(issues, context, () => normalizeStringArray(parsedFm.signals, 'signals', context));
  collectIssue(issues, context, () =>
    normalizeStringArray(parsedFm.pipelineStages, 'pipelineStages', context)
  );
  collectIssue(issues, context, () => normalizeStringArray(parsedFm.tags, 'tags', context));
  collectIssue(issues, context, () =>
    normalizeStringArray(parsedFm.dependsOn, 'dependsOn', context)
  );
  collectIssue(issues, context, () =>
    normalizeStringArray(parsedFm.references, 'references', context)
  );
  collectIssue(issues, context, () =>
    normalizeEvidenceLinks(parsedFm, context, { allowLegacyFallback: false })
  );
  collectIssue(issues, context, () => normalizeMetricEvidence(parsedFm.metricEvidence, context));
  collectIssue(issues, context, () =>
    normalizeImplementationSnippets(parsedFm.implementationSnippets, context)
  );

  const body = txt.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
  if (body === '...') issues.push('placeholder body');
  if (/\[citation needed\]/i.test(body)) issues.push('contains [citation needed]');

  const populatedAdoptionMetricKeys = ADOPTION_METRIC_FIELDS.filter((key) =>
    typeof parsedFm[key] === 'string' && parsedFm[key].trim()
  );
  const hasAdoptionMetric = populatedAdoptionMetricKeys.length > 0;
  const hasEvidenceLinks = Array.isArray(parsedFm.evidenceLinks) && parsedFm.evidenceLinks.length > 0;
  if (hasAdoptionMetric && !hasEvidenceLinks) {
    warns.push('adoption metric present without evidenceLinks');
  }

  if (parsedFm.metricEvidence && typeof parsedFm.metricEvidence === 'object' && !Array.isArray(parsedFm.metricEvidence)) {
    for (const key of ADOPTION_METRIC_FIELDS) {
      const entry = parsedFm.metricEvidence[key];
      if (!entry) continue;
      if (!populatedAdoptionMetricKeys.includes(key)) {
        warns.push(`metricEvidence.${key} is present without ${key}`);
      }
      if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
        warns.push(`metricEvidence.${key}.sources must contain at least one source`);
      }
    }
  }

  for (const key of populatedAdoptionMetricKeys) {
    if (!parsedFm.metricEvidence || !parsedFm.metricEvidence[key]) {
      warns.push(`${key} is present without metricEvidence.${key}`);
    }
  }

  const curationEntry = curationData[slug];
  if (!curationEntry) {
    warns.push('missing curation entry');
  } else if (!allowedAdoptionResearchStatuses.has(curationEntry.adoptionResearchStatus)) {
    warns.push(`invalid adoptionResearchStatus in curation file: ${curationEntry.adoptionResearchStatus}`);
  }

  if (Array.isArray(parsedFm.references)) {
    if (!sharedRefsAvailable) {
      issues.push('references declared but shared-references corpus is unavailable');
    }
    parsedFm.references.forEach((ref) => {
      if (typeof ref === 'string' && !availableRefs.has(ref)) {
        issues.push(`reference key not found in shared-references: ${ref}`);
      }
    });
  }

  const websiteUrl = normalizeUrl(parsedFm.website);
  if (websiteUrl && Array.isArray(parsedFm.evidenceLinks)) {
    const matchingHomepageEvidence = parsedFm.evidenceLinks.some((link) => normalizeUrl(link?.url) === websiteUrl && looksLikeRootHomepage(link?.url));
    if (matchingHomepageEvidence) {
      warns.push('evidenceLinks relies on the site homepage root URL; prefer a dated post, changelog, docs page, or announcement when possible');
    }

    const duplicateEvidenceUrls = new Map();
    parsedFm.evidenceLinks.forEach((link) => {
      const normalized = normalizeUrl(link?.url);
      if (!normalized) return;
      duplicateEvidenceUrls.set(normalized, (duplicateEvidenceUrls.get(normalized) || 0) + 1);
    });
    for (const [url, count] of duplicateEvidenceUrls.entries()) {
      if (count > 1) {
        warns.push(`evidenceLinks reuses the same URL ${count} times: ${url}`);
      }
    }
  }

  if (issues.length || warns.length) {
    const rel = `content/initiatives/${file}`;
    if (issues.length) {
      console.error(`ERROR ${rel}: ${issues.join('; ')}`);
      errors += issues.length;
    }
    if (warns.length) {
      console.warn(`WARN  ${rel}: ${warns.join('; ')}`);
      warnings += warns.length;
    }
  }
}

for (const slug of Object.keys(curationData)) {
  if (!seenSlugs.has(slug)) {
    console.warn(`WARN  src/data/initiative-curation.json: entry does not match an initiative file: ${slug}`);
    warnings += 1;
  }
}

console.log(`\nLint complete: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
