import { loadInitiatives, type LoadedInitiative } from '../../lib/content-loader';

const dateValue = (value: Date | undefined) => value?.toISOString().slice(0, 10) ?? null;

export async function GET({ site }: { site?: URL }) {
  const origin = site ?? new URL('https://datalicenses.org');
  const items = (await loadInitiatives())
    .sort((a: LoadedInitiative, b: LoadedInitiative) => a.title.localeCompare(b.title))
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      profileUrl: new URL(`/initiatives/${item.slug}`, origin).toString(),
      title: item.title,
      summary: item.summary,
      body: item.body,
      website: item.website,
      status: item.status,
      statusRationale: item.statusRationale,
      archiveReason: item.archiveReason ?? null,
      successor: item.successor ?? null,
      actionsSupported: item.actionsSupported,
      primaryApproachType: item.primaryApproachType,
      jurisdictions: item.jurisdictions,
      signals: item.signals,
      pipelineStages: item.pipelineStages,
      dataTypes: item.dataTypes,
      operator: item.operator ?? null,
      launchDate: dateValue(item.launchDate),
      availability: item.availability ?? null,
      pricing: item.pricing ?? null,
      openSourceStatus: item.openSourceStatus ?? null,
      softwareLicense: item.softwareLicense ?? null,
      rightsContact: item.rightsContact ?? null,
      integrations: item.integrations,
      related: item.related,
      considerations: item.considerations ?? null,
      tags: item.tags,
      usersCount: item.usersCount ?? null,
      dataVolume: item.dataVolume ?? null,
      moneyVolume: item.moneyVolume ?? null,
      metricEvidence: item.metricEvidence ?? null,
      implementationSnippets: item.implementationSnippets ?? [],
      references: item.references,
      referencesResolved: item.referencesResolved,
      evidenceLinks: item.evidenceLinks,
      latestUpdate: dateValue(item.latestUpdate),
      lastChecked: dateValue(item.lastChecked),
      lastModified: dateValue(item.lastModified),
    }));

  const response = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    documentation: new URL('/data', origin).toString(),
    license: {
      name: 'Creative Commons Attribution 4.0 International',
      identifier: 'CC-BY-4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    count: items.length,
    items,
  };

  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
