export type FrenchAmortizationInput = {
  principal: number;
  annualInterestRate: number;
  years: number;
};

export type FrenchAmortizationResult = FrenchAmortizationInput & {
  numberOfPayments: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
};

/**
 * Motor matemático común para préstamos de tipo fijo con sistema francés.
 * Supone cuotas mensuales iguales, con el primer vencimiento un mes después
 * de la formalización. No redondea importes durante el cálculo.
 */
export function calculateFrenchAmortization(input: FrenchAmortizationInput): FrenchAmortizationResult {
  if (!Number.isFinite(input.principal) || input.principal <= 0) throw new RangeError('El principal debe ser un número mayor que 0.');
  if (!Number.isFinite(input.annualInterestRate) || input.annualInterestRate < 0) throw new RangeError('El tipo de interés anual debe ser un número igual o mayor que 0.');
  if (!Number.isInteger(input.years) || input.years < 1) throw new RangeError('El plazo debe ser un número entero mayor que 0.');

  const numberOfPayments = input.years * 12;
  const monthlyRate = input.annualInterestRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? input.principal / numberOfPayments
    : input.principal * monthlyRate / (1 - (1 + monthlyRate) ** -numberOfPayments);
  const totalPaid = monthlyPayment * numberOfPayments;

  if (!Number.isFinite(monthlyPayment) || !Number.isFinite(totalPaid)) throw new RangeError('Los datos introducidos no producen un resultado finito.');

  return {
    ...input,
    numberOfPayments,
    monthlyRate,
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - input.principal,
  };
}
