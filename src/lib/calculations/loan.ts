import { calculateFrenchAmortization } from './french-amortization.ts';

export type LoanInput = {
  principal: number;
  annualInterestRate: number;
  years: number;
  initialFee?: number;
};

export type LoanResult = LoanInput & {
  numberOfPayments: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalInstallments: number;
  totalInterest: number;
  totalCostIncludingFee: number;
  interestPercentageOfPrincipal: number;
};

export class LoanInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoanInputError';
  }
}

const MAX_PRINCIPAL = 10_000_000;
const MAX_ANNUAL_INTEREST_RATE = 100;
const MAX_YEARS = 50;

function validateLoanInput(input: LoanInput): void {
  if (!Number.isFinite(input.principal) || input.principal <= 0 || input.principal > MAX_PRINCIPAL) throw new LoanInputError(`El importe debe ser mayor que 0 y hasta ${MAX_PRINCIPAL.toLocaleString('es-ES')} €.`);
  if (!Number.isFinite(input.annualInterestRate) || input.annualInterestRate < 0 || input.annualInterestRate > MAX_ANNUAL_INTEREST_RATE) throw new LoanInputError(`El TIN debe estar entre 0 % y ${MAX_ANNUAL_INTEREST_RATE} %.`);
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > MAX_YEARS) throw new LoanInputError(`El plazo debe ser un número entero entre 1 y ${MAX_YEARS} años.`);

  if (input.initialFee !== undefined && (!Number.isFinite(input.initialFee) || input.initialFee < 0 || input.initialFee > input.principal)) throw new LoanInputError('La comisión inicial debe ser igual o mayor que 0 e inferior o igual al importe del préstamo.');
}

/** Calcula un préstamo personal fijo; la comisión inicial no modifica la cuota mensual. */
export function calculateLoan(input: LoanInput): LoanResult {
  validateLoanInput(input);
  const amortization = calculateFrenchAmortization(input);
  const initialFee = input.initialFee ?? 0;

  return {
    ...input,
    initialFee,
    numberOfPayments: amortization.numberOfPayments,
    monthlyRate: amortization.monthlyRate,
    monthlyPayment: amortization.monthlyPayment,
    totalInstallments: amortization.totalPaid,
    totalInterest: amortization.totalInterest,
    totalCostIncludingFee: amortization.totalPaid + initialFee,
    interestPercentageOfPrincipal: amortization.totalInterest / input.principal * 100,
  };
}
