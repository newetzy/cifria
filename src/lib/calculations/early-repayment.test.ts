import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEarlyRepayment } from './early-repayment.ts';

test('amortizar reduciendo plazo ahorra intereses y meses', () => {
  const result = calculateEarlyRepayment({ principal: 100000, annualRatePercent: 3, remainingYears: 20, extraPayment: 10000, mode: 'reduce-term' });
  assert.ok(result.interestSaved > 0);
  assert.ok(result.monthsSaved > 0);
  assert.equal(result.newPayment, result.oldPayment);
});

test('amortizar reduciendo cuota mantiene el plazo', () => {
  const result = calculateEarlyRepayment({ principal: 100000, annualRatePercent: 3, remainingYears: 20, extraPayment: 10000, mode: 'reduce-payment' });
  assert.ok(result.newPayment < result.oldPayment);
  assert.equal(result.monthsSaved, 0);
});
