import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

import { parseFrontmatter, slugFromFilename } from '../../../helpers/markdown';
import { loadReferences, type Reference } from '../../../helpers/shared-references';
import initiativeCuration from '../data/initiative-curation.json';
import {
  ADOPTION_METRIC_FIELDS,
  normalizeInitiativeFrontmatter,
  parseVisibility,
  requireMemoType,
} from './content-schema.js';

const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  // Default to standalone repo layout: website -> ../content
  resolve(process.cwd(), '../content');

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
  summary?: string;
  language?: string;
  code: string;
  sourceUrl: string;
  exampleUrl?: string;
  exampleLabel?: string;
};
export type LoadedInitiative = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  website: string;
  actionsSupported: string[];
  primaryApproachType: string;
  jurisdictions: string[];
  signals: string[];
  pipelineStages: string[];
  dataTypes: string[];
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
  status: 'live' | 'wip' | 'archived';
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
  topTenRank?: number;
  topTenNote?: string;
};

type InitiativeCuration = Record<string, {
  adoptionResearchStatus?: AdoptionResearchStatus;
  adoptionResearchNotes?: string;
  topTenRank?: number;
  topTenNote?: string;
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
    const { data, body } = parseFrontmatter(raw);
    const context = `Initiative ${file}`;
    const frontmatter = normalizeInitiativeFrontmatter(
      (data || {}) as Record<string, unknown>,
      context
    );
    const { visibility, type } = frontmatter;
    if (visibility !== 'public') continue;
    const referenceKeys = frontmatter.references;
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
    const evidenceLinks = frontmatter.evidenceLinks as EvidenceLink[];
    const latestEvidenceLink = evidenceLinks[0];
    const adoptionMetricFields = ADOPTION_METRIC_FIELDS.filter((field) => {
      const value =
        field === 'usersCount'
          ? frontmatter.usersCount
          : field === 'dataVolume'
            ? frontmatter.dataVolume
            : frontmatter.moneyVolume;

      return typeof value === 'string' && value.trim();
    });
    const hasAdoptionMetrics = adoptionMetricFields.length > 0;
    const metricEvidence = frontmatter.metricEvidence || {};
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
      title: frontmatter.title,
      summary: frontmatter.summary,
      body,
      website: frontmatter.website,
      actionsSupported: frontmatter.actionsSupported,
      primaryApproachType: frontmatter.primaryApproachType,
      jurisdictions: frontmatter.jurisdictions,
      signals: frontmatter.signals,
      pipelineStages: frontmatter.pipelineStages,
      dataTypes: frontmatter.dataTypes,
      considerations: frontmatter.considerations,
      tags: frontmatter.tags,
      dependsOn: frontmatter.dependsOn,
      usersCount: frontmatter.usersCount,
      dataVolume: frontmatter.dataVolume,
      moneyVolume: frontmatter.moneyVolume,
      metricEvidence: Object.keys(metricEvidence).length > 0 ? metricEvidence : undefined,
      implementationSnippets: frontmatter.implementationSnippets,
      visibility,
      type,
      references: referenceKeys,
      referencesResolved: resolvedReferences,
      status: frontmatter.status,
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
      topTenRank: typeof curation.topTenRank === 'number' ? curation.topTenRank : undefined,
      topTenNote: typeof curation.topTenNote === 'string' ? curation.topTenNote : undefined,
    });
  }

  return items;
}

export async function loadMemo(slug = 'memo') {
  const root = await ensureContentRoot();
  const filePath = join(root, 'memos', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const context = `Memo ${slug}.md`;
  const visibility = parseVisibility(data?.visibility, context);
  requireMemoType(data?.type, context);

  if (visibility !== 'public') {
    throw new Error(`Memo ${slug} is not marked public (visibility: ${visibility})`);
  }

  return { slug, frontmatter: data, body };
}

export async function loadMethodologyPage() {
  const root = await ensureContentRoot();
  const filePath = join(root, 'pages', 'methodology.md');
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const context = 'Page methodology.md';
  const visibility = parseVisibility(data?.visibility, context);

  if (visibility !== 'public') {
    throw new Error(`Page methodology is not marked public (visibility: ${visibility})`);
  }

  return { slug: 'methodology', frontmatter: data, body };
}

export { loadReferences, formatCitation } from '../../../helpers/shared-references';
