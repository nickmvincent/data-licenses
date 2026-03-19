const SITE_ORIGIN = 'https://datalicenses.org';

export function GET({ site }: { site?: URL }) {
  const origin = (site ?? new URL(SITE_ORIGIN)).toString().replace(/\/$/, '');
  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
