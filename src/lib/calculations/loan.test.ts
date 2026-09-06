import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMortgage } from './mortgage.ts';
import { LoanInputError, calculateLoan } from './loan.ts';

const approximatelyEqual = (actual: number, expected: number, tolerance = 0.000001): void => {
  assert.ok(Math.abs(actual - expected) < tolerance, `Expected ${actual} to be approximately ${expected}`);
};

test('calcula un préstamo fijo con sistema francés', () => {
  const result = calculateLoan({ principal: 10_000, annualInterestRate: 5, years: 5 });
  approximatelyEqual(result.monthlyPayment, 188.7123364401099);
  approximatelyEqual(result.totalInterest, 1_322.740186406593);
});

test('calcula correctamente un préstamo al 0 %', () => {
  const result = calculateLoan({ principal: 12_000, annualInterestRate: 0, years: 2 });
  assert.equal(result.monthlyPayment, 500);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalCostIncludingFee, 12_000);
});

test('varía cuota e intereses según plazo y tipo', () => {
  const shortTerm = calculateLoan({ principal: 20_000, annualInterestRate: 3, years: 2 });
  const longTerm = calculateLoan({ principal: 20_000, annualInterestRate: 8, years: 8 });
  assert.ok(shortTerm.monthlyPayment > longTerm.monthlyPayment);
  assert.ok(longTerm.totalInterest > shortTerm.totalInterest);
});

test('admite importes decimales', () => {
  const result = calculateLoan({ principal: 12_345.67, annualInterestRate: 4.25, years: 3 });
  assert.ok(Number.isFinite(result.monthlyPayment));
  assert.ok(result.totalInterest > 0);
});

test('separa la comisión inicial de la cuota y suma el coste total', () => {
  const withoutFee = calculateLoan({ principal: 10_000, annualInterestRate: 5, years: 5 });
  const withFee = calculateLoan({ principal: 10_000, annualInterestRate: 5, years: 5, initialFee: 125.5 });
  assert.equal(withFee.monthlyPayment, withoutFee.monthlyPayment);
  approximatelyEqual(withFee.totalCostIncludingFee, withoutFee.totalInstallments + 125.5);
});

test('coincide con el motor hipotecario cuando los parámetros son equivalentes', () => {
  const mortgage = calculateMortgage({ propertyPrice: 125_000, downPayment: 25_000, annualInterestRate: 3, years: 20 });
  const loan = calculateLoan({ principal: 100_000, annualInterestRate: 3, years: 20 });
  approximatelyEqual(loan.monthlyPayment, mortgage.monthlyPayment);
  approximatelyEqual(loan.totalInterest, mortgage.totalInterest);
});

test('rechaza valores inválidos y límites no razonables', () => {
  const invalidInputs = [
    { principal: 0, annualInterestRate: 3, years: 5 },
    { principal: -1, annualInterestRate: 3, years: 5 },
    { principal: 1_000, annualInterestRate: -1, years: 5 },
    { principal: 1_000, annualInterestRate: 101, years: 5 },
    { principal: 1_000, annualInterestRate: 3, years: 0 },
    { principal: 1_000, annualInterestRate: 3, years: 5, initialFee: -1 },
    { principal: Number.NaN, annualInterestRate: 3, years: 5 },
  ];

  invalidInputs.forEach((input) => assert.throws(() => calculateLoan(input), LoanInputError));
});
