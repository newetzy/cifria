export type SavingsGoalInput = {
  initialCapital: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  targetAmount: number;
};

export type SavingsGoalResult = SavingsGoalInput & {
  months: number;
  years: number;
  investedCapital: number;
  estimatedInterest: number;
  finalCapital: number;
};

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  if (!Number.isFinite(input.initialCapital) || input.initialCapital < 0) throw new RangeError('El capital inicial debe ser un número igual o mayor que 0.');
  if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution <= 0) throw new RangeError('La aportación mensual debe ser mayor que 0.');
  if (!Number.isFinite(input.annualReturnPercent) || input.annualReturnPercent < 0 || input.annualReturnPercent > 100) throw new RangeError('La rentabilidad anual debe estar entre 0 % y 100 %.');
  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= input.initialCapital) throw new RangeError('El objetivo debe ser superior al capital inicial.');

  const monthlyRate = input.annualReturnPercent / 100 / 12;
  let capital = input.initialCapital;
  let months = 0;
  const maxMonths = 1200;

  while (capital < input.targetAmount && months < maxMonths) {
    capital += capital * monthlyRate;
    capital += input.monthlyContribution;
    months += 1;
  }

  if (capital < input.targetAmount) throw new RangeError('Con estas aportaciones y rentabilidad no se alcanza el objetivo en 100 años.');

  const investedCapital = input.initialCapital + input.monthlyContribution * months;

  return {
    ...input,
    months,
    years: months / 12,
    investedCapital,
    estimatedInterest: capital - investedCapital,
    finalCapital: capital,
  };
}
