import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateInflation } from './inflation.ts';

test('calcula el coste futuro con inflación', () => {
  const result = calculateInflation({ amount: 100, annualInflationPercent: 10, years: 2 });
  assert.equal(Number(result.futureCost.toFixed(2)), 121);
  assert.equal(Number(result.purchasingPower.toFixed(2)), 82.64);
});
