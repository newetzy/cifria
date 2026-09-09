import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src/pages');
const files = [];
const routes = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.astro')) {
      if (entry.name === '404.astro') continue;
      const relative = path.relative(root, full).split(path.sep).join('/');
      if (relative.includes('[')) continue;
      const route = relative === 'index.astro'
        ? '/'
        : relative.endsWith('/index.astro')
          ? `/${relative.slice(0, -'/index.astro'.length)}/`
          : `/${relative.slice(0, -'.astro'.length)}/`;
      routes.add(route);
      files.push({ full, relative, route, source: fs.readFileSync(full, 'utf8') });
    }
  }
}
walk(root);

const report = { pages: files.length, routes: routes.size, missingMetadata: [], duplicateTitles: [], duplicateDescriptions: [], multipleH1: [], missingH1: [], brokenInternalLinks: [], noindex: [] };
const titleMap = new Map();
const descriptionMap = new Map();
const hrefPattern = /href=["'](\/[^"'#? ]*\/)["']/g;

for (const file of files) {
  const layoutMatch = file.source.match(/<Layout\b[\s\S]*?title=['\"]([^'\"]+)['\"][\s\S]*?description=['\"]([^'\"]+)['\"]/);
  if (!layoutMatch) report.missingMetadata.push(file.route);
  else {
    const [, title, description] = layoutMatch;
    titleMap.set(title, [...(titleMap.get(title) ?? []), file.route]);
    descriptionMap.set(description, [...(descriptionMap.get(description) ?? []), file.route]);
  }
  const h1 = (file.source.match(/<h1\b/g) ?? []).length;
  const delegatedH1 = /<CalculatorShell\b|<CategoryPage\b|<GuidePage\b|<SeoLandingPage\b|<GlossaryPage\b/.test(file.source);
  if (!delegatedH1 && h1 === 0) report.missingH1.push(file.route);
  if (!delegatedH1 && h1 > 1) report.multipleH1.push(file.route);
  if (/\bnoindex\b/.test(file.source)) report.noindex.push(file.route);
  for (const match of file.source.matchAll(hrefPattern)) {
    const href = match[1];
    if (href.startsWith('//') || href.startsWith('/_')) continue;
    if (!routes.has(href) && href !== '/buscar/' && href !== '/ads.txt' && href !== '/robots.txt' && href !== '/sitemap.xml' && href !== '/sitemap-index.xml') {
      report.brokenInternalLinks.push({ from: file.route, href });
    }
  }
}

for (const [title, routesForTitle] of titleMap) if (routesForTitle.length > 1) report.duplicateTitles.push({ title, routes: routesForTitle });
for (const [description, routesForDescription] of descriptionMap) if (routesForDescription.length > 1) report.duplicateDescriptions.push({ description, routes: routesForDescription });

console.log(JSON.stringify(report, null, 2));
const hardFailures = [
  report.missingMetadata.length,
  report.duplicateTitles.length,
  report.multipleH1.length,
  report.missingH1.length,
  report.brokenInternalLinks.length,
].reduce((sum, n) => sum + n, 0);
process.exitCode = hardFailures ? 1 : 0;
