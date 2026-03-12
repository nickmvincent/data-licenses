#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYaml } from 'js-yaml';

const dir = join(process.cwd(), '..', 'content', 'initiatives');
const sharedRefsDir = join(process.cwd(), '..', 'content', 'shared-references');

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

let errors = 0;
let warnings = 0;

// Load available reference keys once
const availableRefs = new Set();
try {
  if (existsSync(sharedRefsDir)) {
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

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const p = join(dir, file);
  const txt = readFileSync(p, 'utf8');
  const fm = extractFrontmatter(txt);
  const parsedFm = fm ? loadYaml(fm) || {} : {};
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

  if (Array.isArray(parsedFm.evidenceLinks)) {
    parsedFm.evidenceLinks.forEach((link, index) => {
      if (!link || typeof link !== 'object') {
        warns.push(`evidenceLinks[${index}] is not an object`);
        return;
      }
      if (!isUrl(stripQuotes(link.url))) warns.push(`evidenceLinks[${index}].url does not look like a URL`);
      if (!link.date || Number.isNaN(new Date(String(link.date)).getTime())) {
        warns.push(`evidenceLinks[${index}].date is not a valid date`);
      }
    });
  }

  if (Array.isArray(parsedFm.references)) {
    parsedFm.references.forEach((ref) => {
      if (typeof ref === 'string' && availableRefs.size && !availableRefs.has(ref)) {
        warns.push(`reference key not found in shared-references: ${ref}`);
      }
    });
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

console.log(`\nLint complete: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
