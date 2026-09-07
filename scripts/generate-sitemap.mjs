import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src/pages');
const paths = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.astro')) {
      const relative = path.relative(root, full).split(path.sep).join('/');
      if (relative === '404.astro') continue;
      if (relative === 'buscar/index.astro') continue;
      if (relative.endsWith('/index.astro')) {
        const parent = relative.slice(0, -'/index.astro'.length);
        paths.push(parent ? `/${parent}/` : '/');
      } else {
        paths.push(`/${relative.slice(0, -'.astro'.length)}/`);
      }
    }
  }
}

walk(root);
const unique = [...new Set(paths)].sort((a, b) => a.localeCompare(b));
const output = `// Auto-generado por scripts/generate-sitemap.mjs. No edites a mano.\nexport const paths = ${JSON.stringify(unique, null, 2)} as const;\n`;
fs.writeFileSync(path.resolve(process.cwd(), 'src/data/site-paths.ts'), output, 'utf8');
console.log(`Sitemap data generated: ${unique.length} paths`);
