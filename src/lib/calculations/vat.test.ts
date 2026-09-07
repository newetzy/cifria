import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVat } from './vat.ts';

test('anade IVA general del 21 por ciento', () => {
  const result = calculateVat({ amount: 100, ratePercent: 21, mode: 'add' });
  assert.equal(result.vat, 21);
  assert.equal(result.total, 121);
});

test('quita IVA del precio final', () => {
  const result = calculateVat({ amount: 121, ratePercent: 21, mode: 'remove' });
  assert.ok(Math.abs(result.base - 100) < 0.00001);
  assert.ok(Math.abs(result.vat - 21) < 0.00001);
});
