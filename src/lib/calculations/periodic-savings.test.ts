import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePeriodicSavings } from './periodic-savings.ts';

test('calcula ahorro sin rentabilidad', () => {
  const result = calculatePeriodicSavings({ initialCapital: 1000, monthlyContribution: 100, annualRatePercent: 0, years: 1 });
  assert.equal(result.finalCapital, 2200);
  assert.equal(result.interestEarned, 0);
});

test('calcula crecimiento con rentabilidad', () => {
  const result = calculatePeriodicSavings({ initialCapital: 0, monthlyContribution: 100, annualRatePercent: 12, years: 1 });
  assert.ok(result.finalCapital > 1200);
  assert.ok(result.interestEarned > 0);
});
