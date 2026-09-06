import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response('User-agent: *\nAllow: /\nSitemap: https://cifria.es/sitemap-index.xml\n');
