import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Published pages deliberately excluded from search. seo:audit also compares
// the sitemap with the rendered robots tags, including future/dynamic routes.
const excludedPages = new Set([
  '404.astro', 'buscar/index.astro', 'aviso-legal.astro',
  'cookies.astro', 'privacidad.astro', 'fuentes-metodologia.astro',
]);

export function collectSitemapPaths(root, blogRoot) {
  const paths = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.astro')) {
        const relative = path.relative(root, full).split(path.sep).join('/');
        if (excludedPages.has(relative) || relative.includes('[')) continue;
        if (relative === 'index.astro') paths.push('/');
        else if (relative.endsWith('/index.astro')) paths.push(`/${relative.slice(0, -'/index.astro'.length)}/`);
        else paths.push(`/${relative.slice(0, -'.astro'.length)}/`);
      }
    }
  }

  walk(root);
  if (blogRoot && fs.existsSync(blogRoot)) paths.push(...collectBlogSitemapPaths(blogRoot));
  return [...new Set(paths)].sort((a, b) => a.localeCompare(b));
}

export function collectBlogSitemapPaths(root) {
  const paths = ['/blog/'];
  const categories = new Set();

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        const source = fs.readFileSync(full, 'utf8');
        if (/^draft:\s*true\s*$/m.test(source)) continue;
        const relative = path.relative(root, full).split(path.sep).join('/').replace(/\.md$/, '');
        paths.push(`/blog/${relative}/`);
        const category = source.match(/^category:\s*["']?([^\n"']+)["']?\s*$/m)?.[1]?.trim();
        if (category) categories.add(category);
      }
    }
  }

  walk(root);
  for (const category of categories) paths.push(`/blog/categoria/${category}/`);
  return paths;
}

export function generateSitemapData(pagesRoot, outputFile, blogRoot) {
  const paths = collectSitemapPaths(pagesRoot, blogRoot);
  const output = `// Auto-generado por scripts/generate-sitemap.mjs. No edites a mano.\nexport const paths = ${JSON.stringify(paths, null, 2)} as const;\n`;
  fs.writeFileSync(outputFile, output, 'utf8');
  return paths;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  const projectRoot = process.cwd();
  const paths = generateSitemapData(
    path.resolve(projectRoot, 'src/pages'),
    path.resolve(projectRoot, 'src/data/site-paths.ts'),
    path.resolve(projectRoot, 'src/content/blog'),
  );
  console.log(`Sitemap data generated: ${paths.length} paths`);
}
