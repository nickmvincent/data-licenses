// @ts-nocheck

/** @typedef {'live' | 'wip' | 'archived'} InitiativeStatus */
/** @typedef {'public' | 'private' | 'draft'} Visibility */
/** @typedef {'explicit' | 'derived'} MetricEvidenceBasis */
/** @typedef {'populated' | 'needs-research' | 'hard-to-quantify'} AdoptionResearchStatus */
/** @typedef {{ label: string, url: string, date: Date }} EvidenceLink */
/** @typedef {{ basis?: MetricEvidenceBasis, notes?: string, sources: EvidenceLink[] }} MetricEvidenceEntry */
/**
 * @typedef {{
 *   title: string,
 *   summary?: string,
 *   language?: string,
 *   code: string,
 *   sourceUrl: string,
 *   exampleUrl?: string,
 *   exampleLabel?: string
 * }} ImplementationSnippet
 */
/**
 * @typedef {Object} NormalizedInitiativeFrontmatter
 * @property {string | undefined} id
 * @property {string} title
 * @property {string} summary
 * @property {string} website
 * @property {InitiativeStatus} status
 * @property {Visibility} visibility
 * @property {'data_license_initiative'} type
 * @property {string[]} actionsSupported
 * @property {string} primaryApproachType
 * @property {string[]} jurisdictions
 * @property {string[]} signals
 * @property {string[]} pipelineStages
 * @property {string[]} dataTypes
 * @property {string | undefined} considerations
 * @property {string[]} tags
 * @property {string[]} dependsOn
 * @property {string | undefined} usersCount
 * @property {string | undefined} dataVolume
 * @property {string | undefined} moneyVolume
 * @property {Record<string, MetricEvidenceEntry | undefined> | undefined} metricEvidence
 * @property {ImplementationSnippet[] | undefined} implementationSnippets
 * @property {string[]} references
 * @property {EvidenceLink[]} evidenceLinks
 */

const INITIATIVE_TYPE = 'data_license_initiative';
const MEMO_TYPE = 'data_license_memo';

export const ADOPTION_METRIC_FIELDS = ['usersCount', 'dataVolume', 'moneyVolume'];
export const ADOPTION_RESEARCH_STATUSES = ['populated', 'needs-research', 'hard-to-quantify'];

const VALID_STATUSES = new Set(['live', 'wip', 'archived']);
const VALID_VISIBILITY = new Set(['public', 'private', 'draft']);
const VALID_METRIC_EVIDENCE_BASIS = new Set(['explicit', 'derived']);

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function optionalString(value) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function requireString(value, field, context) {
  const text = optionalString(value);
  if (!text) {
    throw new Error(`${context} is missing required frontmatter field: ${field}`);
  }

  return text;
}

export function requireUrlString(value, field, context) {
  const url = requireString(value, field, context);
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`${context} has an invalid URL in ${field}: ${url}`);
  }
}

function coerceDate(value) {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function parseStatus(value, context) {
  const raw = requireString(value, 'status', context);
  const normalized = raw.toLowerCase();
  if (normalized === 'w.i.p.' || normalized === 'wip.') return 'wip';
  if (VALID_STATUSES.has(normalized)) return /** @type {InitiativeStatus} */ (normalized);
  throw new Error(`${context} has an invalid status: ${raw}`);
}

export function parseVisibility(value, context) {
  const visibility = requireString(value, 'visibility', context).toLowerCase();
  if (VALID_VISIBILITY.has(visibility)) return /** @type {Visibility} */ (visibility);
  throw new Error(`${context} has an invalid visibility: ${visibility}`);
}

function requireContentType(value, expectedType, context) {
  const type = requireString(value, 'type', context);
  if (type === expectedType) return type;
  throw new Error(`${context} has an unexpected type: ${type}`);
}

export function requireInitiativeType(value, context) {
  return /** @type {'data_license_initiative'} */ (requireContentType(value, INITIATIVE_TYPE, context));
}

export function requireMemoType(value, context) {
  return /** @type {'data_license_memo'} */ (requireContentType(value, MEMO_TYPE, context));
}

export function normalizeStringArray(value, field, context) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${context} has invalid ${field}: expected an array`);
  }

  return value.map((entry, index) => requireString(entry, `${field}[${index}]`, context));
}

export function requirePrimaryApproachType(value, actionsSupported, context) {
  const primaryApproachType = requireString(value, 'primaryApproachType', context);
  if (!Array.isArray(actionsSupported) || actionsSupported.length === 0) {
    throw new Error(`${context} has invalid actionsSupported: expected at least one approach type`);
  }
  if (!actionsSupported.includes(primaryApproachType)) {
    throw new Error(
      `${context} has invalid primaryApproachType: ${primaryApproachType} must also appear in actionsSupported`
    );
  }
  return primaryApproachType;
}

function cleanLegacyEvidenceLabel(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'Latest update';
  const withoutUrl = text.replace(/\s*\(https?:\/\/[^)]+\)\s*$/, '').trim();
  return withoutUrl || 'Latest update';
}

function extractUrl(value) {
  if (typeof value !== 'string') return undefined;
  const match = value.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : undefined;
}

function normalizeEvidenceCollection(value, context, field = 'evidenceLinks') {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${context} has invalid ${field}: expected an array`);
  }

  return value
    .map((link, index) => {
      if (!link || typeof link !== 'object' || Array.isArray(link)) {
        throw new Error(`${context} has invalid ${field}[${index}]: expected an object`);
      }

      return {
        label: requireString(link.label, `${field}[${index}].label`, context),
        url: requireUrlString(link.url, `${field}[${index}].url`, context),
        date: (() => {
          const date = coerceDate(link.date);
          if (!date) {
            throw new Error(`${context} has invalid ${field}[${index}].date`);
          }
          return date;
        })(),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function normalizeEvidenceLinks(data, context, options = {}) {
  const { allowLegacyFallback = true } = options;
  const hasExplicitEvidenceLinks = hasOwn(data, 'evidenceLinks');
  const explicitLinks = normalizeEvidenceCollection(data.evidenceLinks, context);

  if (hasExplicitEvidenceLinks || !allowLegacyFallback) {
    return explicitLinks;
  }

  const legacyDate = coerceDate(data.recentActivity) || coerceDate(data.lastUpdated);
  const legacyUrl =
    optionalString(data.linkWithEvidenceOfUse) ||
    optionalString(data.pressPage) ||
    extractUrl(data.recentActivityNote) ||
    optionalString(data.website);

  if (!legacyDate || !legacyUrl) return explicitLinks;

  return [
    {
      label: cleanLegacyEvidenceLabel(data.recentActivityNote),
      url: legacyUrl,
      date: legacyDate,
    },
  ];
}

export function normalizeMetricEvidence(value, context) {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context} has invalid metricEvidence: expected an object`);
  }

  /** @type {Record<string, MetricEvidenceEntry | undefined>} */
  const normalized = {};

  for (const field of ADOPTION_METRIC_FIELDS) {
    if (!hasOwn(value, field) || value[field] === undefined || value[field] === null) continue;

    const entry = value[field];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${context} has invalid metricEvidence.${field}: expected an object`);
    }

    let basis;
    if (entry.basis !== undefined) {
      const rawBasis = requireString(entry.basis, `metricEvidence.${field}.basis`, context).toLowerCase();
      if (!VALID_METRIC_EVIDENCE_BASIS.has(rawBasis)) {
        throw new Error(`${context} has invalid metricEvidence.${field}.basis: ${rawBasis}`);
      }
      basis = /** @type {MetricEvidenceBasis} */ (rawBasis);
    }

    const notes = optionalString(entry.notes);
    const sources = normalizeEvidenceCollection(
      entry.sources,
      context,
      `metricEvidence.${field}.sources`
    );
    if (sources.length === 0) {
      throw new Error(`${context} has invalid metricEvidence.${field}.sources: expected a non-empty array`);
    }

    normalized[field] = {
      ...(basis ? { basis } : {}),
      ...(notes ? { notes } : {}),
      sources,
    };
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function normalizeImplementationSnippets(value, context) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new Error(`${context} has invalid implementationSnippets: expected an array`);
  }

  return value.map((snippet, index) => {
    if (!snippet || typeof snippet !== 'object' || Array.isArray(snippet)) {
      throw new Error(`${context} has invalid implementationSnippets[${index}]: expected an object`);
    }

    return {
      title: requireString(snippet.title, `implementationSnippets[${index}].title`, context),
      summary: optionalString(snippet.summary),
      language: optionalString(snippet.language),
      code: requireString(snippet.code, `implementationSnippets[${index}].code`, context),
      sourceUrl: requireUrlString(
        snippet.sourceUrl,
        `implementationSnippets[${index}].sourceUrl`,
        context
      ),
      exampleUrl:
        snippet.exampleUrl === undefined
          ? undefined
          : requireUrlString(snippet.exampleUrl, `implementationSnippets[${index}].exampleUrl`, context),
      exampleLabel: optionalString(snippet.exampleLabel),
    };
  });
}

export function normalizeInitiativeFrontmatter(data, context, options = {}) {
  const { allowLegacyEvidenceFallback = true } = options;
  const actionsSupported = normalizeStringArray(data.actionsSupported, 'actionsSupported', context);
  if (actionsSupported.length === 0) {
    throw new Error(`${context} has invalid actionsSupported: expected at least one approach type`);
  }

  return /** @type {NormalizedInitiativeFrontmatter} */ ({
    id: optionalString(data.id),
    title: requireString(data.title, 'title', context),
    summary: requireString(data.summary, 'summary', context),
    website: requireUrlString(data.website, 'website', context),
    status: parseStatus(data.status, context),
    visibility: parseVisibility(data.visibility, context),
    type: requireInitiativeType(data.type, context),
    actionsSupported,
    primaryApproachType: requirePrimaryApproachType(data.primaryApproachType, actionsSupported, context),
    jurisdictions: normalizeStringArray(data.jurisdictions, 'jurisdictions', context),
    signals: normalizeStringArray(data.signals, 'signals', context),
    pipelineStages: normalizeStringArray(data.pipelineStages, 'pipelineStages', context),
    dataTypes: normalizeStringArray(data.dataTypes, 'dataTypes', context),
    considerations: optionalString(data.considerations),
    tags: normalizeStringArray(data.tags, 'tags', context),
    dependsOn: normalizeStringArray(data.dependsOn, 'dependsOn', context),
    usersCount: optionalString(data.usersCount),
    dataVolume: optionalString(data.dataVolume),
    moneyVolume: optionalString(data.moneyVolume),
    metricEvidence: normalizeMetricEvidence(data.metricEvidence, context),
    implementationSnippets: normalizeImplementationSnippets(data.implementationSnippets, context),
    references: normalizeStringArray(data.references, 'references', context),
    evidenceLinks: normalizeEvidenceLinks(data, context, {
      allowLegacyFallback: allowLegacyEvidenceFallback,
    }),
  });
}

export function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/$/, '') || '/'}`;
  } catch {
    return null;
  }
}

export function looksLikeRootHomepage(value) {
  try {
    const url = new URL(String(value || ''));
    return url.pathname === '/' || url.pathname === '';
  } catch {
    return false;
  }
}

export function stripContextFromMessage(error, context) {
  const message = error instanceof Error ? error.message : String(error);
  const prefix = `${context} `;
  return message.startsWith(prefix) ? message.slice(prefix.length) : message;
}
