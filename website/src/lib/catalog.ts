import type { LoadedInitiative } from './content-loader';

export const APPROACH_KEYS = [
  'attach-preference-signal',
  'attach-formal-license',
  'join-licensing-collective',
  'data-market-platform',
  'add-tollgate',
  'technical-blocking',
  'rights-registry',
  'protocol-standard',
  'governed-data-sharing',
  'certification',
] as const;
type ApproachKey = typeof APPROACH_KEYS[number];

export const ACTION_LABELS: Record<string, string> = {
  'attach-preference-signal': 'Preference signal',
  'attach-formal-license': 'Formal license',
  'join-licensing-collective': 'Licensing collective',
  'data-market-platform': 'Marketplace',
  'add-tollgate': 'Tollgate',
  'technical-blocking': 'Technical blocking',
  'rights-registry': 'Rights registry',
  'protocol-standard': 'Protocol or standard',
  'governed-data-sharing': 'Governed data sharing',
  certification: 'Certification',
};

export const PIPELINE_LABELS: Record<string, string> = {
  collect: 'Collect',
  train: 'Train',
  'fine-tune': 'Fine-tune',
  evaluate: 'Evaluate',
  retrieve: 'Retrieve',
  generate: 'Generate',
};

export const DATA_TYPE_LABELS: Record<string, string> = {
  'web-content': 'Web content',
  text: 'Text',
  images: 'Images',
  video: 'Video',
  audio: 'Audio',
  music: 'Music',
  code: 'Code',
  'structured-data': 'Structured data',
  multimodal: 'Multimodal',
};

export const STATUS_LABELS: Record<string, string> = {
  live: 'Live',
  wip: 'In progress',
  archived: 'Archived',
};

export const ARCHIVE_REASON_LABELS: Record<string, string> = {
  discontinued: 'Discontinued',
  acquired: 'Acquired or absorbed',
  superseded: 'Replaced or superseded',
  dormant: 'Dormant or no recent evidence',
  'out-of-scope': 'No longer in scope',
  unknown: 'Status unknown',
};

export const EVIDENCE_SOURCE_LABELS: Record<string, string> = {
  primary: 'Primary source',
  partner: 'Partner or customer source',
  independent: 'Independent source',
};

export const ENFORCEMENT_DETAILS: Record<
  ApproachKey,
  { label: string; shortLabel: string; description: string; caveat: string }
> = {
  'attach-preference-signal': {
    label: 'Voluntary preference signal',
    shortLabel: 'Voluntary signal',
    description: 'Communicates a requested condition or restriction to automated systems.',
    caveat: 'It only affects actors that detect and honor the signal; it does not itself prevent reuse.',
  },
  'attach-formal-license': {
    label: 'Legal or license terms',
    shortLabel: 'Legal terms',
    description: 'States permissions, restrictions, or conditions for AI-related reuse.',
    caveat: 'Practical effect depends on applicable law, rights ownership, notice, and contract formation.',
  },
  'join-licensing-collective': {
    label: 'Collective contractual licensing',
    shortLabel: 'Contractual licensing',
    description: 'Coordinates licenses and negotiations across participating rights holders.',
    caveat: 'Coverage and enforcement depend on participation, represented rights, and the resulting agreements.',
  },
  'data-market-platform': {
    label: 'Contractual marketplace access',
    shortLabel: 'Contractual access',
    description: 'Offers governed data or content access under platform or transaction terms.',
    caveat: 'Terms govern participating transactions; they do not control copies obtained elsewhere.',
  },
  'add-tollgate': {
    label: 'Metered or authenticated access',
    shortLabel: 'Access control',
    description: 'Conditions access on payment, authentication, identity, or usage limits.',
    caveat: 'It can control the protected access path, but cannot guarantee control of downstream copies or alternate routes.',
  },
  'technical-blocking': {
    label: 'Technical access control',
    shortLabel: 'Technical control',
    description: 'Detects, rate-limits, challenges, or blocks automated collection.',
    caveat: 'It can reduce access but may be bypassed and does not determine the legality of downstream use.',
  },
  'rights-registry': {
    label: 'Rights registry infrastructure',
    shortLabel: 'Registry infrastructure',
    description: 'Records rights, preferences, declarations, or provenance for later lookup.',
    caveat: 'Practical force depends on reliable identity, accurate declarations, adoption, and downstream use of the registry.',
  },
  'protocol-standard': {
    label: 'Protocol or coordination standard',
    shortLabel: 'Protocol or standard',
    description: 'Defines shared messages, workflows, or interfaces for communicating and applying data-use conditions.',
    caveat: 'Practical force depends on implementation, interoperability, adoption, and any legal or technical controls built around it.',
  },
  'governed-data-sharing': {
    label: 'Governed data-sharing infrastructure',
    shortLabel: 'Governed sharing',
    description: 'Creates controlled ways to contribute, host, access, or compute with data under stated governance terms.',
    caveat: 'Practical force depends on participation, access rules, technical configuration, and governance after data is shared.',
  },
  certification: {
    label: 'Third-party attestation',
    shortLabel: 'Attestation',
    description: 'Reviews or signals whether a system follows stated sourcing criteria.',
    caveat: 'Certification provides an assessment or claim; it does not itself authorize, prevent, or enforce reuse.',
  },
};

export const APPROACH_DETAILS: Record<
  ApproachKey,
  { title: string; shortDescription: string; description: string }
> = {
  'attach-preference-signal': {
    title: 'Preference signal',
    shortDescription: 'Publishes machine-readable AI-use preferences.',
    description:
      'Signals that express whether AI systems may crawl, train on, or reuse content, usually through metadata, headers, or other machine-readable notices.',
  },
  'attach-formal-license': {
    title: 'Formal license',
    shortDescription: 'Uses explicit license terms for AI reuse.',
    description:
      'Formal legal terms or license language that grant, restrict, or condition AI-related reuse of content, datasets, or model inputs.',
  },
  'join-licensing-collective': {
    title: 'Licensing collective',
    shortDescription: 'Coordinates licensing across many rights holders.',
    description:
      'Shared bargaining, aggregation, or rights-management structures that let many publishers or creators negotiate AI access together.',
  },
  'data-market-platform': {
    title: 'Marketplace',
    shortDescription: 'Matches data suppliers with AI buyers.',
    description:
      'Commercial platforms or brokers that package, list, or sell access to datasets, content libraries, or licensing opportunities for AI use.',
  },
  'add-tollgate': {
    title: 'Tollgate',
    shortDescription: 'Makes AI access conditional on payment or metering.',
    description:
      'Access layers that require payment, metering, or authenticated entry before content can be fetched, queried, or reused for AI workflows.',
  },
  'technical-blocking': {
    title: 'Technical blocking',
    shortDescription: 'Blocks or constrains automated access.',
    description:
      'Technical controls that deny, rate-limit, or otherwise constrain crawling, downloading, or automated collection unless a requester meets specific conditions.',
  },
  'rights-registry': {
    title: 'Rights registry',
    shortDescription: 'Records rights, preferences, or provenance for later lookup.',
    description:
      'Registries that publish or resolve declarations about rights, provenance, opt-outs, licenses, or permitted reuse.',
  },
  'protocol-standard': {
    title: 'Protocol or standard',
    shortDescription: 'Defines interoperable messages and workflows.',
    description:
      'Standards, protocols, and shared interfaces that help systems communicate or apply data-use preferences, terms, identity, and access conditions.',
  },
  'governed-data-sharing': {
    title: 'Governed data sharing',
    shortDescription: 'Provides controlled ways to contribute or access data.',
    description:
      'Infrastructure and governance models for sharing, hosting, or computing with data under contributor, community, or platform-defined conditions.',
  },
  certification: {
    title: 'Certification',
    shortDescription: 'Verifies or signals compliant sourcing practices.',
    description:
      'Third-party review, badges, or verification programs that signal whether a model, company, or dataset follows stated sourcing or licensing requirements.',
  },
};

export function statusRank(status: string) {
  if (status === 'live') return 0;
  if (status === 'wip') return 1;
  if (status === 'archived') return 2;
  return 3;
}

export function sortByLatestThenTitle(a: LoadedInitiative, b: LoadedInitiative) {
  const aLatest = a.latestUpdate ? new Date(a.latestUpdate).getTime() : 0;
  const bLatest = b.latestUpdate ? new Date(b.latestUpdate).getTime() : 0;
  if (aLatest !== bLatest) return bLatest - aLatest;

  const rankDiff = statusRank(a.status) - statusRank(b.status);
  if (rankDiff !== 0) return rankDiff;

  return a.title.localeCompare(b.title);
}

export function sortByFeaturedThenTitle(a: LoadedInitiative, b: LoadedInitiative) {
  if (a.featuredRank !== b.featuredRank) return a.featuredRank - b.featuredRank;
  return a.title.localeCompare(b.title);
}

export function formatDate(value: Date | string | undefined) {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

export function formatLinkLabel(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname.replace(/\/$/, '');
    return path && path !== '/' ? `${host}${path}` : host;
  } catch {
    return url;
  }
}

export function formatLinkTitle(url: string, label?: string) {
  const normalizedLabel = typeof label === 'string' ? label.replace(/\s+/g, ' ').trim() : '';
  if (!normalizedLabel || normalizedLabel === url) return url;
  return `${normalizedLabel}\n${url}`;
}

export function formatApproachLabel(action: string) {
  return ACTION_LABELS[action] || action;
}

export function formatActionSummary(actionsSupported: string[]) {
  if (!Array.isArray(actionsSupported) || actionsSupported.length === 0) return 'Uncategorized';
  return actionsSupported.map((action) => formatApproachLabel(action)).join(' / ');
}

export function formatPipelineSummary(pipelineStages: string[]) {
  if (!Array.isArray(pipelineStages) || pipelineStages.length === 0) return '';
  return `Pipeline: ${pipelineStages.map((stage) => PIPELINE_LABELS[stage] || stage).join(' -> ')}`;
}

export function formatDataTypeLabel(dataType: string) {
  return DATA_TYPE_LABELS[dataType] || dataType;
}

export function getEnforcementDetails(action: string) {
  return ENFORCEMENT_DETAILS[action as ApproachKey] || {
    label: 'Unclassified mechanism',
    shortLabel: 'Unclassified',
    description: 'The catalog has not classified this initiative\'s practical enforcement mode.',
    caveat: 'Review the initiative\'s public terms and technical documentation before relying on it.',
  };
}
