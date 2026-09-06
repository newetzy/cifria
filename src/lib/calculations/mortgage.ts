export type MortgageInput = {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  years: number;
  monthlyNetIncome?: number;
};

export type MortgageResult = MortgageInput & {
  financedAmount: number;
  numberOfPayments: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalLoanCost: number;
  loanToValuePercent: number;
  paymentToIncomePercent?: number;
};

export class MortgageInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MortgageInputError';
  }
}

const MAX_PROPERTY_PRICE = 10_000_000;
const MAX_ANNUAL_INTEREST_RATE = 100;
const MAX_YEARS = 50;
const MAX_MONTHLY_INCOME = 1_000_000;

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new MortgageInputError(`${label} debe ser un número válido.`);
}

function validateMortgageInput(input: MortgageInput): void {
  assertFinite(input.propertyPrice, 'El precio de la vivienda');
  assertFinite(input.downPayment, 'La entrada inicial');
  assertFinite(input.annualInterestRate, 'El tipo de interés anual');
  assertFinite(input.years, 'El plazo');

  if (input.propertyPrice <= 0 || input.propertyPrice > MAX_PROPERTY_PRICE) throw new MortgageInputError(`El precio de la vivienda debe estar entre 0 y ${MAX_PROPERTY_PRICE.toLocaleString('es-ES')} €.`);
  if (input.downPayment < 0 || input.downPayment >= input.propertyPrice) throw new MortgageInputError('La entrada debe ser igual o mayor que 0 e inferior al precio de la vivienda.');
  if (input.annualInterestRate < 0 || input.annualInterestRate > MAX_ANNUAL_INTEREST_RATE) throw new MortgageInputError(`El tipo de interés anual debe estar entre 0 % y ${MAX_ANNUAL_INTEREST_RATE} %.`);
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > MAX_YEARS) throw new MortgageInputError(`El plazo debe ser un número entero entre 1 y ${MAX_YEARS} años.`);

  if (input.monthlyNetIncome !== undefined) {
    assertFinite(input.monthlyNetIncome, 'Los ingresos netos mensuales');
    if (input.monthlyNetIncome <= 0 || input.monthlyNetIncome > MAX_MONTHLY_INCOME) throw new MortgageInputError('Los ingresos netos mensuales deben ser mayores que 0 dentro del límite de la simulación.');
  }
}

/**
 * Calcula una hipoteca de tipo fijo con amortización francesa.
 * Supone pagos mensuales iguales y que el primer pago se realiza un mes después de la firma.
 * No incluye comisiones, seguros, impuestos ni gastos de compraventa.
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  validateMortgageInput(input);

  const financedAmount = input.propertyPrice - input.downPayment;
  const numberOfPayments = input.years * 12;
  const monthlyRate = input.annualInterestRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? financedAmount / numberOfPayments
    : financedAmount * monthlyRate / (1 - (1 + monthlyRate) ** -numberOfPayments);
  const totalPaid = monthlyPayment * numberOfPayments;
  const totalInterest = totalPaid - financedAmount;

  return {
    ...input,
    financedAmount,
    numberOfPayments,
    monthlyRate,
    monthlyPayment,
    totalPaid,
    totalInterest,
    totalLoanCost: totalPaid,
    loanToValuePercent: financedAmount / input.propertyPrice * 100,
    paymentToIncomePercent: input.monthlyNetIncome === undefined ? undefined : monthlyPayment / input.monthlyNetIncome * 100,
  };
}
