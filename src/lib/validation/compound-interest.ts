import type { CompoundInterestInput } from '../calculations/compound-interest';

export type CompoundInterestField = keyof CompoundInterestInput;
export type CompoundInterestFormErrors = Partial<Record<CompoundInterestField, string>>;

const fields: Array<{ key: CompoundInterestField; label: string }> = [
  { key: 'initialCapital', label: 'El capital inicial' },
  { key: 'monthlyContribution', label: 'La aportación mensual' },
  { key: 'annualReturnPercent', label: 'La rentabilidad anual' },
  { key: 'years', label: 'El plazo' },
];

export function validateCompoundInterestForm(input: CompoundInterestInput): CompoundInterestFormErrors {
  const errors: CompoundInterestFormErrors = {};

  for (const { key, label } of fields) {
    if (!Number.isFinite(input[key])) errors[key] = `${label} debe ser un número válido.`;
    else if (input[key] < 0) errors[key] = `${label} no puede ser negativo.`;
  }

  if (!errors.annualReturnPercent && input.annualReturnPercent > 100) errors.annualReturnPercent = 'Introduce una rentabilidad entre 0 % y 100 %.';
  if (!errors.years && (!Number.isInteger(input.years) || input.years < 1 || input.years > 100)) errors.years = 'Introduce un plazo completo entre 1 y 100 años.';

  return errors;
}
