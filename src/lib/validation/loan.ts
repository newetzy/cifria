import type { LoanInput } from '../calculations/loan';

export type LoanFormErrors = Partial<Record<keyof LoanInput, string>>;

export function validateLoanForm(input: LoanInput): LoanFormErrors {
  const errors: LoanFormErrors = {};
  if (!Number.isFinite(input.principal) || input.principal <= 0 || input.principal > 10_000_000) errors.principal = 'Introduce un importe mayor que 0 y hasta 10.000.000 €.';
  if (!Number.isFinite(input.annualInterestRate) || input.annualInterestRate < 0 || input.annualInterestRate > 100) errors.annualInterestRate = 'Introduce un TIN entre 0 % y 100 %.';
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > 50) errors.years = 'Introduce un plazo completo entre 1 y 50 años.';
  if (input.initialFee !== undefined && (!Number.isFinite(input.initialFee) || input.initialFee < 0 || input.initialFee > input.principal)) errors.initialFee = 'Introduce una comisión entre 0 € y el importe del préstamo, o deja el campo vacío.';
  return errors;
}
