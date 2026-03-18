import type { LoadedInitiative } from './content-loader';

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
};

export const SECTION_KEYS = ['new-approaches', 'markets-with-new-approaches', 'markets-only'] as const;
export type CatalogSectionKey = typeof SECTION_KEYS[number];

export const SECTION_DETAILS: Record<CatalogSectionKey, { title: string; description: string }> = {
  'new-approaches': {
    title: 'New approaches',
    description:
      'Signals, licenses, infrastructure, blocking, tollgates, certification, and other non-market approaches.',
  },
  'markets-with-new-approaches': {
    title: 'Markets with new approaches',
    description:
      'Marketplace entries that also add at least one other approach from the catalog.',
  },
  'markets-only': {
    title: 'Markets only',
    description: 'Entries whose only catalog approach is a marketplace.',
  },
};

export function statusRank(status: string) {
  return status === 'live' ? 0 : 1;
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

export function formatActionSummary(actionsSupported: string[]) {
  if (!Array.isArray(actionsSupported) || actionsSupported.length === 0) return 'Uncategorized';
  return actionsSupported.map((action) => ACTION_LABELS[action] || action).join(' / ');
}

export function formatPipelineSummary(pipelineStages: string[]) {
  if (!Array.isArray(pipelineStages) || pipelineStages.length === 0) return '';
  return `Pipeline: ${pipelineStages.map((stage) => PIPELINE_LABELS[stage] || stage).join(' -> ')}`;
}

export function formatDataTypeLabel(dataType: string) {
  return DATA_TYPE_LABELS[dataType] || dataType;
}

export function catalogSectionForItem(
  item: Pick<LoadedInitiative, 'actionsSupported'>
): CatalogSectionKey {
  const actions = Array.isArray(item.actionsSupported) ? item.actionsSupported : [];
  const hasMarketplace = actions.includes('data-market-platform');
  const hasOtherApproaches = actions.some((action) => action !== 'data-market-platform');

  if (hasMarketplace && !hasOtherApproaches) return 'markets-only';
  if (hasMarketplace && hasOtherApproaches) return 'markets-with-new-approaches';
  return 'new-approaches';
}
