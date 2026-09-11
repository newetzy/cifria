import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { tools } from '../src/data/tools.ts';
import { categories } from '../src/data/categories.ts';

const pagesRoot = path.resolve('src/pages');

function resourcePages(directory = pagesRoot) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return resourcePages(file);
    if (!file.endsWith('.astro')) return [];
    const source = fs.readFileSync(file, 'utf8');
    const route = `/${path.relative(pagesRoot, file).split(path.sep).join('/').replace(/\.astro$/, '')}/`;
    if (/<CalculatorShell\b/.test(source)) return [{ route, type: 'calculadora' }];
    if (/<SeoLandingPage\b/.test(source)) return [{ route, type: route.startsWith('/comparadores/') ? 'comparador' : 'escenario' }];
    if (/<GuidePage\b/.test(source)) return [{ route, type: 'guia' }];
    if (/<GlossaryPage\b/.test(source)) return [{ route, type: 'glosario' }];
    return [];
  });
}

test('el catálogo cubre los recursos publicados con su tipo real y sin duplicados', () => {
  const expected = resourcePages();
  assert.equal(new Set(tools.map((tool) => tool.href)).size, tools.length);
  assert.deepEqual(tools.map((tool) => tool.href).sort(), expected.map((page) => page.route).sort());
  for (const page of expected) {
    assert.equal(tools.find((tool) => tool.href === page.route)?.type, page.type, page.route);
  }
  assert.equal(tools.filter((tool) => tool.type === 'comparador').length, 8);
});

test('impuestos incluye IRPF e IVA y todas las calculadoras temáticas tienen categoría', () => {
  const tax = tools.filter((tool) => tool.type === 'calculadora' && tool.category === 'Impuestos');
  assert.deepEqual(tax.map((tool) => tool.href).sort(), [
    '/impuestos/calculadora-irpf/', '/impuestos/calculadora-iva/',
  ]);
  for (const tool of tools.filter((tool) => tool.type === 'calculadora' && !tool.href.startsWith('/calculadoras/'))) {
    const category = categories.find((category) => tool.href.startsWith(`/${category.slug}/`));
    assert.equal(tool.category, category?.name, tool.href);
  }
});
