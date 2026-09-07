export interface SimpleInterestInput {
  principal: number;
  annualRatePercent: number;
  years: number;
}
export interface SimpleInterestResult { interest: number; finalAmount: number; }
export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  if (!Number.isFinite(input.principal) || input.principal < 0) throw new Error('El capital no puede ser negativo.');
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) throw new Error('El tipo no puede ser negativo.');
  if (!Number.isFinite(input.years) || input.years <= 0) throw new Error('El plazo debe ser mayor que cero.');
  const interest = input.principal * (input.annualRatePercent / 100) * input.years;
  return { interest, finalAmount: input.principal + interest };
}
