import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSimpleInterest } from './simple-interest.ts';

test('calcula interes simple', () => {
  const result = calculateSimpleInterest({ principal: 1000, annualRatePercent: 5, years: 2 });
  assert.equal(result.interest, 100);
  assert.equal(result.finalAmount, 1100);
});
