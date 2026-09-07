export interface PeriodicSavingsInput {
  initialCapital: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}

export interface PeriodicSavingsResult {
  finalCapital: number;
  contributedCapital: number;
  interestEarned: number;
}

export function calculatePeriodicSavings(input: PeriodicSavingsInput): PeriodicSavingsResult {
  if (!Number.isFinite(input.initialCapital) || input.initialCapital < 0) throw new Error('El capital inicial no puede ser negativo.');
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution < 0) throw new Error('La aportacion mensual no puede ser negativa.');
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) throw new Error('La rentabilidad anual no puede ser negativa.');
  if (!Number.isFinite(input.years) || input.years <= 0) throw new Error('El plazo debe ser mayor que cero.');

  const months = Math.round(input.years * 12);
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const finalCapital = monthlyRate === 0
    ? input.initialCapital + input.monthlyContribution * months
    : input.initialCapital * Math.pow(1 + monthlyRate, months) + input.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const contributedCapital = input.initialCapital + input.monthlyContribution * months;
  return { finalCapital, contributedCapital, interestEarned: finalCapital - contributedCapital };
}
