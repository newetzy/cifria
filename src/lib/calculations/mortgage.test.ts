import assert from 'node:assert/strict';
import test from 'node:test';
import { MortgageInputError, calculateMortgage } from './mortgage.ts';

const approximatelyEqual = (actual: number, expected: number, tolerance = 0.000001): void => {
  assert.ok(Math.abs(actual - expected) < tolerance, `Expected ${actual} to be approximately ${expected}`);
};

test('calcula una cuota fija con el sistema francés', () => {
  const result = calculateMortgage({ propertyPrice: 125_000, downPayment: 25_000, annualInterestRate: 3, years: 20 });
  approximatelyEqual(result.monthlyPayment, 554.5975978539207);
  approximatelyEqual(result.totalInterest, 33_103.423484940955);
  assert.equal(result.financedAmount, 100_000);
  assert.equal(result.loanToValuePercent, 80);
});

test('calcula correctamente una hipoteca al 0 %', () => {
  const result = calculateMortgage({ propertyPrice: 120_000, downPayment: 20_000, annualInterestRate: 0, years: 20 });
  approximatelyEqual(result.monthlyPayment, 100_000 / 240);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalPaid, 100_000);
});

test('admite una entrada de 0 y plazos distintos', () => {
  const shortTerm = calculateMortgage({ propertyPrice: 100_000, downPayment: 0, annualInterestRate: 2, years: 1 });
  const longTerm = calculateMortgage({ propertyPrice: 100_000, downPayment: 0, annualInterestRate: 2, years: 30 });
  assert.equal(shortTerm.loanToValuePercent, 100);
  assert.ok(shortTerm.monthlyPayment > longTerm.monthlyPayment);
  assert.ok(longTerm.totalInterest > shortTerm.totalInterest);
});

test('calcula ratio de cuota e ingresos solo cuando se facilita', () => {
  const withIncome = calculateMortgage({ propertyPrice: 200_000, downPayment: 40_000, annualInterestRate: 3.5, years: 25, monthlyNetIncome: 3_000 });
  const withoutIncome = calculateMortgage({ propertyPrice: 200_000, downPayment: 40_000, annualInterestRate: 3.5, years: 25 });
  approximatelyEqual(withIncome.paymentToIncomePercent!, withIncome.monthlyPayment / 3_000 * 100);
  assert.equal(withoutIncome.paymentToIncomePercent, undefined);
});

test('conserva precisión con importes decimales', () => {
  const result = calculateMortgage({ propertyPrice: 199_999.99, downPayment: 39_999.99, annualInterestRate: 2.75, years: 17 });
  assert.equal(result.financedAmount, 160_000);
  assert.ok(Number.isFinite(result.monthlyPayment));
  assert.ok(result.totalInterest > 0);
});

test('rechaza entradas inválidas', () => {
  const invalidInputs = [
    { propertyPrice: 0, downPayment: 0, annualInterestRate: 3, years: 20 },
    { propertyPrice: 100_000, downPayment: -1, annualInterestRate: 3, years: 20 },
    { propertyPrice: 100_000, downPayment: 100_000, annualInterestRate: 3, years: 20 },
    { propertyPrice: 100_000, downPayment: 20_000, annualInterestRate: -1, years: 20 },
    { propertyPrice: 100_000, downPayment: 20_000, annualInterestRate: 3, years: 0 },
    { propertyPrice: Number.NaN, downPayment: 20_000, annualInterestRate: 3, years: 20 },
  ];

  invalidInputs.forEach((input) => assert.throws(() => calculateMortgage(input), MortgageInputError));
});
