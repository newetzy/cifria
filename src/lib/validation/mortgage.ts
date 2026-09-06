import type { MortgageInput } from '../calculations/mortgage';

export type MortgageField = keyof MortgageInput;
export type MortgageFormErrors = Partial<Record<MortgageField, string>>;

export function validateMortgageForm(input: MortgageInput): MortgageFormErrors {
  const errors: MortgageFormErrors = {};
  const requiredFields: Array<{ key: Exclude<MortgageField, 'monthlyNetIncome'>; label: string }> = [
    { key: 'propertyPrice', label: 'El precio de la vivienda' },
    { key: 'downPayment', label: 'La entrada inicial' },
    { key: 'annualInterestRate', label: 'El tipo de interés anual' },
    { key: 'years', label: 'El plazo' },
  ];

  requiredFields.forEach(({ key, label }) => {
    if (!Number.isFinite(input[key])) errors[key] = `${label} debe ser un número válido.`;
  });

  if (!errors.propertyPrice && (input.propertyPrice <= 0 || input.propertyPrice > 10_000_000)) errors.propertyPrice = 'Introduce un precio mayor que 0 y hasta 10.000.000 €.';
  if (!errors.downPayment && input.downPayment < 0) errors.downPayment = 'La entrada inicial no puede ser negativa.';
  if (!errors.downPayment && !errors.propertyPrice && input.downPayment >= input.propertyPrice) errors.downPayment = 'La entrada debe ser inferior al precio de la vivienda.';
  if (!errors.annualInterestRate && (input.annualInterestRate < 0 || input.annualInterestRate > 100)) errors.annualInterestRate = 'Introduce un tipo de interés entre 0 % y 100 %.';
  if (!errors.years && (!Number.isInteger(input.years) || input.years < 1 || input.years > 50)) errors.years = 'Introduce un plazo completo entre 1 y 50 años.';

  if (input.monthlyNetIncome !== undefined && (!Number.isFinite(input.monthlyNetIncome) || input.monthlyNetIncome <= 0 || input.monthlyNetIncome > 1_000_000)) errors.monthlyNetIncome = 'Introduce ingresos mayores que 0 y hasta 1.000.000 €, o deja el campo vacío.';
  return errors;
}
