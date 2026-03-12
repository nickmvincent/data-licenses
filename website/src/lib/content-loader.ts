import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

import { parseFrontmatter, slugFromFilename } from '../../../helpers/markdown';
import { loadReferences, type Reference } from '../../../helpers/shared-references';
import initiativeCuration from '../data/initiative-curation.json';

const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  // Default to standalone repo layout: website -> ../content
  resolve(process.cwd(), '../content');

function coerceDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? undefined : d;
}

function normalizeStatus(value: unknown): 'live' | 'wip' {
  const normalized = String(value || '').trim().toLowerCase();
  if (String(value || '').trim() === 'WIP') return 'wip';
  if (normalized === 'wip' || normalized === 'w.i.p.' || normalized === 'wip.') return 'wip';
  return 'live';
}

function cleanLegacyEvidenceLabel(value: unknown): string {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'Latest update';
  const withoutUrl = text.replace(/\s*\(https?:\/\/[^)]+\)\s*$/, '').trim();
  return withoutUrl || 'Latest update';
}

function extractUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const match = value.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : undefined;
}

function normalizeEvidenceLinks(data: Record<string, unknown>) {
  const rawLinks = Array.isArray(data.evidenceLinks) ? data.evidenceLinks : [];
  const normalized = rawLinks
    .map((link) => {
      if (!link || typeof link !== 'object') return null;
      const url = typeof link.url === 'string' ? link.url : '';
      const label = typeof link.label === 'string' ? link.label : '';
      const date = coerceDate((link as Record<string, unknown>).date);
      if (!url || !date) return null;
      return { label: label || 'Evidence link', url, date };
    })
    .filter(Boolean) as Array<{ label: string; url: string; date: Date }>;

  if (normalized.length === 0) {
    const legacyDate = coerceDate(data.recentActivity) || coerceDate(data.lastUpdated);
    const legacyUrl =
      (typeof data.linkWithEvidenceOfUse === 'string' && data.linkWithEvidenceOfUse) ||
      (typeof data.pressPage === 'string' && data.pressPage) ||
      extractUrl(data.recentActivityNote) ||
      (typeof data.website === 'string' && data.website) ||
      undefined;

    if (legacyDate && legacyUrl) {
      normalized.push({
        label: cleanLegacyEvidenceLabel(data.recentActivityNote),
        url: legacyUrl,
        date: legacyDate,
      });
    }
  }

  return normalized.sort((a, b) => b.date.getTime() - a.date.getTime());
}

type AdoptionResearchStatus = 'populated' | 'needs-research' | 'hard-to-quantify';
type EvidenceStatus = 'tracked' | 'needs-sourcing';
type MetricEvidenceStatus = 'not-applicable' | 'sourced' | 'partial' | 'missing';

type EvidenceLink = { label: string; url: string; date: Date };
type MetricEvidenceEntry = {
  basis?: 'explicit' | 'derived';
  notes?: string;
  sources?: EvidenceLink[];
};
type ImplementationSnippet = {
  title: string;
  language?: string;
  code: string;
  sourceUrl: string;
};
type InitiativeFrontmatter = Record<string, unknown> & {
  id?: string;
  title?: string;
  summary?: string;
  website?: string;
  status?: string;
  actionsSupported?: string[];
  jurisdictions?: string[];
  signals?: string[];
  pipelineStages?: string[];
  considerations?: string;
  tags?: string[];
  dependsOn?: string[];
  usersCount?: string;
  dataVolume?: string;
  moneyVolume?: string;
  metricEvidence?: Record<string, MetricEvidenceEntry | undefined>;
  implementationSnippets?: ImplementationSnippet[];
  references?: string[];
  visibility?: string;
  type?: string;
};

export type LoadedInitiative = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  website: string;
  actionsSupported: string[];
  jurisdictions: string[];
  signals: string[];
  pipelineStages: string[];
  considerations?: string;
  tags: string[];
  dependsOn: string[];
  usersCount?: string;
  dataVolume?: string;
  moneyVolume?: string;
  metricEvidence?: Record<string, MetricEvidenceEntry | undefined>;
  implementationSnippets?: ImplementationSnippet[];
  visibility?: string;
  type?: string;
  references: string[];
  referencesResolved: Reference[];
  status: 'live' | 'wip';
  evidenceLinks: EvidenceLink[];
  latestEvidenceLink?: EvidenceLink;
  latestUpdate?: Date;
  evidenceStatus: EvidenceStatus;
  hasAdoptionMetrics: boolean;
  adoptionMetricFields: string[];
  hasMetricEvidence: boolean;
  metricEvidenceFields: string[];
  metricEvidenceStatus: MetricEvidenceStatus;
  adoptionResearchStatus: AdoptionResearchStatus;
  adoptionResearchNotes?: string;
};

type InitiativeCuration = Record<string, {
  adoptionResearchStatus?: AdoptionResearchStatus;
  adoptionResearchNotes?: string;
}>;

const curationBySlug = initiativeCuration as InitiativeCuration;

async function ensureContentRoot(): Promise<string> {
  const target = resolve(DEFAULT_CONTENT_DIR);
  try {
    await fs.access(target);
    return target;
  } catch (err) {
    const msg = [
      'Could not find external content directory.',
      `Expected at: ${target}`,
      'Set DATA_LICENSES_CONTENT_DIR to override this path.',
    ].join(' ');
    throw new Error(msg);
  }
}

export async function loadInitiatives(): Promise<LoadedInitiative[]> {
  const root = await ensureContentRoot();
  const dir = join(root, 'initiatives');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  const allReferences = await loadReferences();

  const items: LoadedInitiative[] = [];
  for (const file of files) {
    const raw = await fs.readFile(join(dir, file), 'utf8');
    const { data } = parseFrontmatter(raw);
    const frontmatter = (data || {}) as InitiativeFrontmatter;

    if (frontmatter.visibility && frontmatter.visibility !== 'public') continue;
    if (frontmatter.type && frontmatter.type !== 'data_license_initiative') continue;

    const referenceKeys = Array.isArray(frontmatter.references)
      ? frontmatter.references.filter((k): k is string => typeof k === 'string')
      : [];
    if (referenceKeys.length > 0 && allReferences.size === 0) {
      throw new Error(
        `Initiative ${file} declares references, but no shared references could be loaded from content/shared-references/bibtex-entries.`
      );
    }
    const missingReferenceKeys = referenceKeys.filter((key) => !allReferences.has(key));
    if (missingReferenceKeys.length > 0) {
      throw new Error(
        `Initiative ${file} references unknown citation key(s): ${missingReferenceKeys.join(', ')}`
      );
    }
    const resolvedReferences = referenceKeys
      .map((key) => allReferences.get(key))
      .filter((reference): reference is Reference => Boolean(reference));

    const slug = slugFromFilename(file);
    const evidenceLinks = normalizeEvidenceLinks(frontmatter) as EvidenceLink[];
    const latestEvidenceLink = evidenceLinks[0];
    const adoptionMetricFields = ['usersCount', 'dataVolume', 'moneyVolume'].filter(
      (field) => typeof frontmatter[field] === 'string' && String(frontmatter[field]).trim()
    );
    const hasAdoptionMetrics = adoptionMetricFields.length > 0;
    const metricEvidence =
      frontmatter.metricEvidence && typeof frontmatter.metricEvidence === 'object'
        ? frontmatter.metricEvidence
        : {};
    const metricEvidenceFields = adoptionMetricFields.filter((field) => {
      const entry = metricEvidence[field];
      return Array.isArray(entry?.sources) && entry.sources.length > 0;
    });
    const hasMetricEvidence = metricEvidenceFields.length > 0;
    const metricEvidenceStatus = !hasAdoptionMetrics
      ? 'not-applicable'
      : metricEvidenceFields.length === adoptionMetricFields.length
        ? 'sourced'
        : hasMetricEvidence
          ? 'partial'
          : 'missing';
    const curation = curationBySlug[slug] || {};
    const evidenceStatus = evidenceLinks.length > 0 ? 'tracked' : 'needs-sourcing';
    const adoptionResearchStatus = curation.adoptionResearchStatus || (hasAdoptionMetrics ? 'populated' : 'needs-research');

    items.push({
      id: frontmatter.id || slug,
      slug,
      title: typeof frontmatter.title === 'string' ? frontmatter.title : slug,
      summary: typeof frontmatter.summary === 'string' ? frontmatter.summary : '',
      website: typeof frontmatter.website === 'string' ? frontmatter.website : '',
      actionsSupported: Array.isArray(frontmatter.actionsSupported)
        ? frontmatter.actionsSupported.filter((value): value is string => typeof value === 'string')
        : [],
      jurisdictions: Array.isArray(frontmatter.jurisdictions)
        ? frontmatter.jurisdictions.filter((value): value is string => typeof value === 'string')
        : [],
      signals: Array.isArray(frontmatter.signals)
        ? frontmatter.signals.filter((value): value is string => typeof value === 'string')
        : [],
      pipelineStages: Array.isArray(frontmatter.pipelineStages)
        ? frontmatter.pipelineStages.filter((value): value is string => typeof value === 'string')
        : [],
      considerations: typeof frontmatter.considerations === 'string' ? frontmatter.considerations : undefined,
      tags: Array.isArray(frontmatter.tags)
        ? frontmatter.tags.filter((value): value is string => typeof value === 'string')
        : [],
      dependsOn: Array.isArray(frontmatter.dependsOn)
        ? frontmatter.dependsOn.filter((value): value is string => typeof value === 'string')
        : [],
      usersCount: typeof frontmatter.usersCount === 'string' ? frontmatter.usersCount : undefined,
      dataVolume: typeof frontmatter.dataVolume === 'string' ? frontmatter.dataVolume : undefined,
      moneyVolume: typeof frontmatter.moneyVolume === 'string' ? frontmatter.moneyVolume : undefined,
      metricEvidence: Object.keys(metricEvidence).length > 0 ? metricEvidence : undefined,
      implementationSnippets: Array.isArray(frontmatter.implementationSnippets)
        ? frontmatter.implementationSnippets
        : undefined,
      visibility: frontmatter.visibility,
      type: frontmatter.type,
      references: referenceKeys,
      referencesResolved: resolvedReferences,
      status: normalizeStatus(frontmatter.status),
      evidenceLinks,
      latestEvidenceLink,
      latestUpdate: latestEvidenceLink?.date,
      evidenceStatus,
      hasAdoptionMetrics,
      adoptionMetricFields,
      hasMetricEvidence,
      metricEvidenceFields,
      metricEvidenceStatus,
      adoptionResearchStatus,
      adoptionResearchNotes: curation.adoptionResearchNotes,
    });
  }

  return items;
}

export async function loadMemo(slug = 'memo') {
  const root = await ensureContentRoot();
  const filePath = join(root, 'memos', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);

  if (data?.visibility && data.visibility !== 'public') {
    throw new Error(`Memo ${slug} is not marked public (visibility: ${data.visibility})`);
  }
  if (data?.type && data.type !== 'data_license_memo') {
    throw new Error(`Memo ${slug} has unexpected type: ${data.type}`);
  }

  return { slug, frontmatter: data, body };
}

export async function loadContentMeta() {
  const root = await ensureContentRoot();
  return { root };
}

export { loadReferences, loadReferencesByKeys, formatCitation } from '../../../helpers/shared-references';
