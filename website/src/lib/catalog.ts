import type { LoadedInitiative } from './content-loader';

export const APPROACH_KEYS = [
  'attach-preference-signal',
  'attach-formal-license',
  'join-licensing-collective',
  'data-market-platform',
  'add-tollgate',
  'technical-blocking',
  'new-infrastructures',
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
  'new-infrastructures': 'New infrastructure',
  certification: 'Certification',
};

export const PIPELINE_LABELS: Record<string, string> = {
  collect: 'Collect',
  train: 'Train',
  'fine-tune': 'Fine-tune',
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
  wip: 'WIP',
  archived: 'Archived',
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
  'new-infrastructures': {
    title: 'New infrastructure',
    shortDescription: 'Builds new rails for governed data sharing.',
    description:
      'New registries, protocols, hosting patterns, or coordination layers that make governed data access, compliance, or contribution easier to operate.',
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

export function formatDate(value: Date | string | undefined) {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
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
