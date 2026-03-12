import { loadInitiatives, type LoadedInitiative } from '../../lib/content-loader';

function increment<T extends string>(bucket: Record<T, number>, key: T) {
  bucket[key] = (bucket[key] || 0) + 1;
}

export async function GET() {
  const items = (await loadInitiatives())
    .sort((a: LoadedInitiative, b: LoadedInitiative) => (a.title || '').localeCompare(b.title || ''))
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      website: item.website,
      status: item.status,
      latestUpdate: item.latestUpdate ?? null,
      evidenceStatus: item.evidenceStatus,
      hasAdoptionMetrics: item.hasAdoptionMetrics,
      adoptionMetricFields: item.adoptionMetricFields,
      hasMetricEvidence: item.hasMetricEvidence,
      metricEvidenceFields: item.metricEvidenceFields,
      metricEvidenceStatus: item.metricEvidenceStatus,
      adoptionResearchStatus: item.adoptionResearchStatus,
      adoptionResearchNotes: item.adoptionResearchNotes ?? null,
    }));

  const summary = {
    evidenceStatus: { tracked: 0, 'needs-sourcing': 0 },
    metricEvidenceStatus: {
      sourced: 0,
      partial: 0,
      missing: 0,
      'not-applicable': 0,
    },
    adoptionResearchStatus: {
      populated: 0,
      'needs-research': 0,
      'hard-to-quantify': 0,
    },
  };

  for (const item of items) {
    increment(summary.evidenceStatus, item.evidenceStatus);
    increment(summary.metricEvidenceStatus, item.metricEvidenceStatus);
    increment(summary.adoptionResearchStatus, item.adoptionResearchStatus);
  }

  return new Response(JSON.stringify({ count: items.length, summary, items }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
