import { loadInitiatives } from '../lib/content-loader';

const SITE_ORIGIN = 'https://datalicenses.org';
const STATIC_PATHS = ['/', '/catalog', '/glossary', '/methodology', '/contributing'];

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET({ site }: { site?: URL }) {
  const origin = site ?? new URL(SITE_ORIGIN);
  const initiatives = await loadInitiatives();

  const entries = [
    ...STATIC_PATHS.map((path) => ({
      loc: new URL(path, origin).toString(),
      lastmod: undefined,
    })),
    ...initiatives.map((item) => ({
      loc: new URL(`/initiatives/${item.slug}`, origin).toString(),
      lastmod: item.latestUpdate || undefined,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `
    <lastmod>${escapeXml(new Date(entry.lastmod).toISOString())}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
