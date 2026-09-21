import { paths } from '../data/site-paths.ts';

const publishedPaths = new Set<string>(paths);

export function getBreadcrumbPaths(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const isScenarioPage = segments.length > 2 && segments[1] === 'escenarios';
  const candidates = isScenarioPage
    ? [`/${segments[0]}/`, '/escenarios/', pathname]
    : segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}/`);

  return candidates.filter((href) => href === pathname || publishedPaths.has(href));
}