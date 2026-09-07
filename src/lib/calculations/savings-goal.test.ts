import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSavingsGoal } from './savings-goal.ts';

test('alcanza un objetivo con aportaciones mensuales sin rentabilidad', () => {
  const result = calculateSavingsGoal({ initialCapital: 0, monthlyContribution: 100, annualReturnPercent: 0, targetAmount: 1000 });
  assert.equal(result.months, 10);
  assert.equal(result.finalCapital, 1000);
});
