import fs from 'node:fs';
import path from 'node:path';
import { seoTargets } from './seo-targets.mjs';

const root = path.resolve(process.cwd(), 'dist');
const routes = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name === 'index.html') {
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      const route = relative === 'index.html' ? '/' : `/${relative.slice(0, -'index.html'.length)}`;
      const html = fs.readFileSync(fullPath, 'utf8');
      const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
      routes.set(route, { fullPath, title });
    }
  }
}

walk(root);

const missingTargets = seoTargets.filter((target) => !routes.has(target.href));
const titleCollisions = new Map();
for (const { title } of routes.values()) {
  if (!title) continue;
  titleCollisions.set(title, (titleCollisions.get(title) ?? 0) + 1);
}
const duplicateTitles = [...titleCollisions.entries()]
  .filter(([, count]) => count > 1)
  .map(([title, count]) => ({ title, count }));

const clusters = {};
for (const target of seoTargets) {
  clusters[target.cluster] ??= [];
  clusters[target.cluster].push(target.href);
}

console.log(JSON.stringify({
  builtPages: routes.size,
  trackedTargets: seoTargets.length,
  missingTargets,
  duplicateTitles,
  clusters,
}, null, 2));

if (missingTargets.length || duplicateTitles.length) process.exitCode = 1;
