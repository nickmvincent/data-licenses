#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYaml } from 'js-yaml';

const dir = join(process.cwd(), '..', 'content', 'initiatives');
const sharedRefsDir = join(process.cwd(), '..', 'content', 'shared-references', 'bibtex-entries');
const curationPath = join(process.cwd(), 'src', 'data', 'initiative-curation.json');
const allowedAdoptionResearchStatuses = new Set(['populated', 'needs-research', 'hard-to-quantify']);
let sharedRefsAvailable = false;

function extractFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function hasKey(fm, key) {
  const re = new RegExp(`^${key}\s*:`, 'm');
  return re.test(fm);
}

function getValue(fm, key) {
  const re = new RegExp(`^${key}\s*:\s*(.+)$`, 'm');
  const m = fm.match(re);
  return m ? m[1].trim() : undefined;
}

function isUrl(s) {
  return /^https?:\/\//i.test(s || '');
}

function stripQuotes(value) {
  return String(value || '').replace(/^['"]|['"]$/g, '');
}

function validateEvidenceCollection(collection, prefix, warns) {
  if (!Array.isArray(collection)) return;
  collection.forEach((link, index) => {
    if (!link || typeof link !== 'object') {
      warns.push(`${prefix}[${index}] is not an object`);
      return;
    }
    if (!isUrl(stripQuotes(link.url))) warns.push(`${prefix}[${index}].url does not look like a URL`);
    if (!link.date || Number.isNaN(new Date(String(link.date)).getTime())) {
      warns.push(`${prefix}[${index}].date is not a valid date`);
    }
  });
}

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/$/, '') || '/'}`;
  } catch {
    return null;
  }
}

function looksLikeRootHomepage(value) {
  try {
    const url = new URL(String(value || ''));
    return url.pathname === '/' || url.pathname === '';
  } catch {
    return false;
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
  const parsedFm = fm ? loadYaml(fm) || {} : {};
  const slug = file.replace(/\.md$/, '');
  seenSlugs.add(slug);
  const issues = [];
  const warns = [];

  if (!hasKey(fm, 'title')) issues.push('missing title');
  if (!hasKey(fm, 'summary')) issues.push('missing summary');
  if (!hasKey(fm, 'status')) issues.push('missing status');

  const allowed = new Set(['live', 'wip']);
  if (hasKey(fm, 'status')) {
    const v = (getValue(fm, 'status') || '').replace(/#.*/, '').trim();
    if (v && !allowed.has(v)) warns.push(`status not in allowed set: ${v}`);
  }

  ['website'].forEach((k) => {
    if (hasKey(fm, k)) {
      const v = stripQuotes(getValue(fm, k)?.replace(/#.*/, '').trim());
      if (v && !isUrl(v)) warns.push(`field ${k} does not look like a URL`);
    }
  });

  validateEvidenceCollection(parsedFm.evidenceLinks, 'evidenceLinks', warns);

  const body = txt.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
  if (body === '...') issues.push('placeholder body');
  if (/\[citation needed\]/i.test(body)) issues.push('contains [citation needed]');

  const adoptionMetricKeys = ['usersCount', 'dataVolume', 'moneyVolume'];
  const populatedAdoptionMetricKeys = adoptionMetricKeys.filter((key) => hasKey(fm, key));
  const hasAdoptionMetric = populatedAdoptionMetricKeys.length > 0;
  const hasEvidenceLinks = Array.isArray(parsedFm.evidenceLinks) && parsedFm.evidenceLinks.length > 0;
  if (hasAdoptionMetric && !hasEvidenceLinks) {
    warns.push('adoption metric present without evidenceLinks');
  }

  if (parsedFm.metricEvidence && typeof parsedFm.metricEvidence === 'object') {
    for (const key of adoptionMetricKeys) {
      const entry = parsedFm.metricEvidence[key];
      if (!entry) continue;
      if (!populatedAdoptionMetricKeys.includes(key)) {
        warns.push(`metricEvidence.${key} is present without ${key}`);
      }
      if (entry.basis && !new Set(['explicit', 'derived']).has(entry.basis)) {
        warns.push(`metricEvidence.${key}.basis must be explicit or derived`);
      }
      if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
        warns.push(`metricEvidence.${key}.sources must contain at least one source`);
        continue;
      }
      validateEvidenceCollection(entry.sources, `metricEvidence.${key}.sources`, warns);
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

  if (hasKey(fm, 'implementationSnippets')) {
    warns.push('implementationSnippets present (not deeply validated)');
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
