const statusRank = {
  live: 0,
  wip: 1,
  archived: 2,
};

/**
 * @param {{ title: string, status: string, latest: number, featuredRank: number }} a
 * @param {{ title: string, status: string, latest: number, featuredRank: number }} b
 * @param {'featured' | 'alpha' | 'status' | 'latest'} mode
 */
export function compareCatalogRecords(a, b, mode) {
  if (mode === 'alpha') return a.title.localeCompare(b.title);
  if (mode === 'status') {
    const difference = (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9);
    return difference || a.title.localeCompare(b.title);
  }
  if (mode === 'latest') {
    return b.latest - a.latest || a.title.localeCompare(b.title);
  }

  return a.featuredRank - b.featuredRank || a.title.localeCompare(b.title);
}

/**
 * @param {{
 *   search: string,
 *   status: string,
 *   actions: string[],
 *   dataTypes: string[],
 *   pipelineStages: string[],
 *   hasAdoption: boolean
 * }} record
 * @param {{
 *   query: string,
 *   status: string,
 *   actions: string[],
 *   dataTypes: string[],
 *   pipelineStages: string[],
 *   adoption: boolean
 * }} state
 */
export function matchesCatalogRecord(record, state) {
  const query = state.query.trim().toLowerCase();
  if (query && !record.search.includes(query)) return false;
  if (state.status !== 'all' && record.status !== state.status) return false;
  if (state.actions.length && !state.actions.some((value) => record.actions.includes(value))) {
    return false;
  }
  if (
    state.dataTypes.length &&
    !state.dataTypes.some((value) => record.dataTypes.includes(value))
  ) {
    return false;
  }
  if (
    state.pipelineStages.length &&
    !state.pipelineStages.some((value) => record.pipelineStages.includes(value))
  ) {
    return false;
  }
  if (state.adoption && !record.hasAdoption) return false;
  return true;
}

/**
 * @param {string} search
 */
export function catalogQueryFromSearch(search) {
  return new URLSearchParams(search).get('q') || '';
}

/**
 * @param {string} pathname
 * @param {string} query
 */
export function catalogUrlForQuery(pathname, query) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  return `${pathname}${params.size ? `?${params}` : ''}#catalog`;
}
