import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { collectSitemapPaths } from './generate-sitemap.mjs';

test('incluye la portada y excluye rutas no indexables', async (t) => {
  const pagesRoot = await mkdtemp(path.join(os.tmpdir(), 'cifria-sitemap-'));
  t.after(() => rm(pagesRoot, { recursive: true, force: true }));

  await Promise.all([
    writeFile(path.join(pagesRoot, 'index.astro'), ''),
    writeFile(path.join(pagesRoot, '404.astro'), ''),
    ...['aviso-legal', 'cookies', 'privacidad', 'fuentes-metodologia'].map((name) =>
      writeFile(path.join(pagesRoot, `${name}.astro`), '<Layout noindex />')),
    mkdir(path.join(pagesRoot, 'buscar')),
    mkdir(path.join(pagesRoot, 'vivienda')),
    mkdir(path.join(pagesRoot, 'guias')),
  ]);
  await Promise.all([
    writeFile(path.join(pagesRoot, 'buscar', 'index.astro'), ''),
    writeFile(path.join(pagesRoot, 'vivienda', 'index.astro'), ''),
    writeFile(path.join(pagesRoot, 'guias', 'interes-compuesto.astro'), ''),
  ]);

  assert.deepEqual(collectSitemapPaths(pagesRoot), [
    '/',
    '/guias/interes-compuesto/',
    '/vivienda/',
  ]);
});

test('incluye artículos y categorías publicados del blog', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cifria-blog-sitemap-'));
  const pagesRoot = path.join(root, 'pages');
  const blogRoot = path.join(root, 'blog');
  t.after(() => rm(root, { recursive: true, force: true }));

  await Promise.all([mkdir(pagesRoot), mkdir(blogRoot)]);
  await Promise.all([
    writeFile(path.join(pagesRoot, 'index.astro'), ''),
    writeFile(path.join(blogRoot, 'vivienda.md'), '---\ncategory: vivienda\ndraft: false\n---'),
    writeFile(path.join(blogRoot, 'borrador.md'), '---\ncategory: fiscalidad\ndraft: true\n---'),
  ]);

  assert.deepEqual(collectSitemapPaths(pagesRoot, blogRoot), [
    '/',
    '/blog/',
    '/blog/categoria/vivienda/',
    '/blog/vivienda/',
  ]);
});
