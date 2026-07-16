import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

import { parseFrontmatter, slugFromFilename } from '../../../helpers/markdown';
import { loadReferences, type Reference } from '../../../helpers/shared-references';
import initiativeCuration from '../data/initiative-curation.json';
import initiativeEditorial from '../data/initiative-editorial.json';
import {
  ADOPTION_METRIC_FIELDS,
  normalizeInitiativeFrontmatter,
  parseVisibility,
} from './content-schema.js';

const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  // Default to standalone repo layout: website -> ../content
  resolve(process.cwd(), '../content');

type AdoptionResearchStatus = 'populated' | 'needs-research' | 'hard-to-quantify';
type EvidenceStatus = 'tracked' | 'needs-sourcing';
type MetricEvidenceStatus = 'not-applicable' | 'sourced' | 'partial' | 'missing';

type EvidenceLink = {
  label: string;
  url: string;
  date: Date;
  sourceType: 'primary' | 'partner' | 'independent';
  archivedUrl?: string;
};
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
  operator?: string;
  launchDate?: Date;
  availability?: string;
  pricing?: string;
  openSourceStatus?: string;
  softwareLicense?: string;
  rightsContact?: string;
  integrations: string[];
  related: string[];
  statusRationale: string;
  archiveReason?: 'discontinued' | 'acquired' | 'superseded' | 'dormant' | 'out-of-scope' | 'unknown';
  successor?: string;
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
  featuredRank: number;
  lastChecked: Date;
  lastModified: Date;
};

type InitiativeCuration = Record<string, {
  adoptionResearchStatus?: AdoptionResearchStatus;
  adoptionResearchNotes?: string;
}>;

const curationBySlug = initiativeCuration as InitiativeCuration;
const editorial = initiativeEditorial as {
  featuredOrder: string[];
  defaultLastChecked: string;
  lastChecked: Record<string, string>;
  lastModified: Record<string, string>;
};
const featuredRankBySlug = new Map(editorial.featuredOrder.map((slug, index) => [slug, index]));

function statusRationaleFor(
  status: LoadedInitiative['status'],
  archiveReason?: LoadedInitiative['archiveReason']
) {
  if (status === 'live') {
    return 'Publicly available or deployable in the latest catalog review.';
  }
  if (status === 'wip') {
    return 'Publicly documented, but still emerging or not fully deployed.';
  }

  const archivedReasons: Record<NonNullable<LoadedInitiative['archiveReason']>, string> = {
    discontinued: 'Archived after public evidence showed that the initiative was discontinued.',
    acquired: 'Archived after the initiative was acquired or absorbed into another offering.',
    superseded: 'Archived after the initiative was replaced or superseded.',
    dormant: 'Archived after a freshness review found no current public development.',
    'out-of-scope': 'Archived because the initiative no longer fits the catalog scope.',
    unknown: 'Archived because current public status could not be verified.',
  };

  return archiveReason
    ? archivedReasons[archiveReason]
    : 'Archived after a freshness review found that it was no longer current.';
}

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
    const evidenceLinks = frontmatter.evidenceLinks.map((link) => ({
      ...link,
      sourceType: link.sourceType || 'primary',
    })) as EvidenceLink[];
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
    const metricEvidence = Object.fromEntries(
      Object.entries(frontmatter.metricEvidence || {}).map(([field, entry]) => [
        field,
        entry
          ? {
              ...entry,
              sources: entry.sources.map((source) => ({
                ...source,
                sourceType: source.sourceType || 'primary',
              })) as EvidenceLink[],
            }
          : undefined,
      ])
    ) as Record<string, MetricEvidenceEntry | undefined>;
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
      operator: frontmatter.operator,
      launchDate: frontmatter.launchDate,
      availability: frontmatter.availability,
      pricing: frontmatter.pricing,
      openSourceStatus: frontmatter.openSourceStatus,
      softwareLicense: frontmatter.softwareLicense,
      rightsContact: frontmatter.rightsContact,
      integrations: frontmatter.integrations,
      related: frontmatter.related,
      statusRationale:
        frontmatter.statusRationale ||
        statusRationaleFor(frontmatter.status, frontmatter.archiveReason),
      archiveReason: frontmatter.archiveReason,
      successor: frontmatter.successor,
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
      featuredRank: featuredRankBySlug.get(slug) ?? Number.MAX_SAFE_INTEGER,
      lastChecked: new Date(editorial.lastChecked[slug] || editorial.defaultLastChecked),
      lastModified: new Date(
        editorial.lastModified[slug] ||
        editorial.lastChecked[slug] ||
        editorial.defaultLastChecked
      ),
    });
  }

  return items;
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
