import assert from 'node:assert/strict';
import test from 'node:test';
import { getBreadcrumbPaths } from '../src/lib/breadcrumbs.ts';
import { paths } from '../src/data/site-paths.ts';

const missingBreadcrumbDestinations = new Set([
  '/vivienda/escenarios/',
  '/prestamos/escenarios/',
  '/ahorro-inversion/escenarios/',
  '/impuestos/escenarios/',
  '/nomina/escenarios/',
  '/coche/escenarios/',
  '/autor/',
]);

test('las migas de escenarios conservan la categoría y usan el índice global publicado', () => {
  for (const route of paths.filter((route) => /^\/(?:[^/]+)\/escenarios\/[^/]+\/$/.test(route))) {
    const category = `/${route.split('/')[1]}/`;
    assert.deepEqual(getBreadcrumbPaths(route), [category, '/escenarios/', route], route);
  }
});

test('las migas solo devuelven rutas publicadas, incluido el autor sin índice', () => {
  for (const route of paths) {
    for (const href of getBreadcrumbPaths(route)) {
      assert.ok(paths.includes(href), `${route} enlaza a ${href}`);
      assert.ok(!missingBreadcrumbDestinations.has(href), `${route} enlaza a ${href}`);
    }
  }
  assert.deepEqual(getBreadcrumbPaths('/autor/carlos/'), ['/autor/carlos/']);
});