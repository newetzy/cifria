import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const client = import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '';
  const publisher = client.startsWith('ca-pub-') ? client.replace('ca-pub-', 'pub-') : '';
  if (!publisher) return new Response('Not configured', { status: 404 });
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
