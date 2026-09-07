import fs from 'node:fs';
import path from 'node:path';
import { seoTargets } from './seo-targets.mjs';

const root = path.resolve('src/pages');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.astro')) files.push(full);
  }
}
walk(root);

const routes = new Map();
for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  let route;
  if (rel === 'index.astro') route = '/';
  else route = `/${rel.replace(/\.astro$/, '').replace(/\/index$/, '')}/`;
  const text = fs.readFileSync(file, 'utf8');
  const title = (text.match(/<Layout\s+title="([^"]+)"/) ?? [])[1] ?? '';
  routes.set(route, { file, title });
}

const missingTargets = seoTargets.filter((target) => !routes.has(target.href));
const titleCollisions = new Map();
for (const { title } of routes.values()) {
  if (!title) continue;
  titleCollisions.set(title, (titleCollisions.get(title) ?? 0) + 1);
}
const duplicateTitles = [...titleCollisions.entries()].filter(([, count]) => count > 1).map(([title, count]) => ({ title, count }));

const clusters = {};
for (const target of seoTargets) {
  clusters[target.cluster] ??= [];
  clusters[target.cluster].push(target.href);
}

console.log(JSON.stringify({
  pages: routes.size,
  trackedTargets: seoTargets.length,
  missingTargets,
  duplicateTitles,
  clusters,
}, null, 2));

if (missingTargets.length || duplicateTitles.length) process.exitCode = 1;
