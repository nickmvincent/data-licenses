import { loadInitiatives, type LoadedInitiative } from '../../lib/content-loader';

export async function GET() {
  const items = (await loadInitiatives()).sort((a: LoadedInitiative, b: LoadedInitiative) =>
    (a.title || '').localeCompare(b.title || '')
  ).map(({ body, ...item }) => item);

  return new Response(JSON.stringify({ count: items.length, items }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
