import assert from 'node:assert/strict';
import test from 'node:test';
import { CompoundInterestInputError, calculateCompoundInterest } from './compound-interest.ts';

const approximatelyEqual = (actual: number, expected: number, tolerance = 0.000001): void => {
  assert.ok(Math.abs(actual - expected) < tolerance, `Expected ${actual} to be approximately ${expected}`);
};

test('capital inicial sin aportaciones', () => {
  const result = calculateCompoundInterest({ initialCapital: 1_000, monthlyContribution: 0, annualReturnPercent: 12, years: 1 });
  approximatelyEqual(result.finalCapital, 1126.8250301319697);
  assert.equal(result.totalContributions, 1_000);
  assert.equal(result.evolution.length, 1);
});

test('aportaciones sin capital inicial', () => {
  const result = calculateCompoundInterest({ initialCapital: 0, monthlyContribution: 100, annualReturnPercent: 0, years: 1 });
  assert.equal(result.finalCapital, 1_200);
  assert.equal(result.totalContributions, 1_200);
  assert.equal(result.interestEarned, 0);
});

test('rentabilidad de 0 %', () => {
  const result = calculateCompoundInterest({ initialCapital: 1_000, monthlyContribution: 100, annualReturnPercent: 0, years: 1 });
  assert.equal(result.finalCapital, 2_200);
  assert.equal(result.interestEarned, 0);
});

test('un año y varios años generan evolución anual', () => {
  const oneYear = calculateCompoundInterest({ initialCapital: 500, monthlyContribution: 25, annualReturnPercent: 4, years: 1 });
  const severalYears = calculateCompoundInterest({ initialCapital: 500, monthlyContribution: 25, annualReturnPercent: 4, years: 5 });
  assert.equal(oneYear.evolution.length, 1);
  assert.equal(severalYears.evolution.length, 5);
  assert.ok(severalYears.finalCapital > severalYears.totalContributions);
});

test('admite importes y porcentajes decimales', () => {
  const result = calculateCompoundInterest({ initialCapital: 1_234.56, monthlyContribution: 78.9, annualReturnPercent: 4.5, years: 3 });
  approximatelyEqual(result.totalContributions, 4_074.96);
  assert.ok(Number.isFinite(result.finalCapital));
  assert.ok(result.interestEarned > 0);
});

test('rechaza entradas inválidas', () => {
  const invalidInputs = [
    { initialCapital: -1, monthlyContribution: 0, annualReturnPercent: 0, years: 1 },
    { initialCapital: 0, monthlyContribution: -1, annualReturnPercent: 0, years: 1 },
    { initialCapital: 0, monthlyContribution: 0, annualReturnPercent: -1, years: 1 },
    { initialCapital: 0, monthlyContribution: 0, annualReturnPercent: 101, years: 1 },
    { initialCapital: 0, monthlyContribution: 0, annualReturnPercent: 0, years: 0 },
    { initialCapital: Number.NaN, monthlyContribution: 0, annualReturnPercent: 0, years: 1 },
  ];

  invalidInputs.forEach((input) => assert.throws(() => calculateCompoundInterest(input), CompoundInterestInputError));
});
