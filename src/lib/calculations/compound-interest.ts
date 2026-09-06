export type CompoundInterestInput = {
  initialCapital: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
};

export type CompoundInterestYear = {
  year: number;
  contributedCapital: number;
  interestEarned: number;
  totalCapital: number;
};

export type CompoundInterestResult = CompoundInterestInput & {
  months: number;
  totalContributions: number;
  interestEarned: number;
  finalCapital: number;
  evolution: CompoundInterestYear[];
};

export class CompoundInterestInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompoundInterestInputError';
  }
}

const MAX_ANNUAL_RETURN_PERCENT = 100;
const MAX_YEARS = 100;

function assertFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new CompoundInterestInputError(`${label} debe ser un número igual o mayor que 0.`);
  }
}

function validateInput(input: CompoundInterestInput): void {
  assertFiniteNonNegative(input.initialCapital, 'El capital inicial');
  assertFiniteNonNegative(input.monthlyContribution, 'La aportación mensual');
  assertFiniteNonNegative(input.annualReturnPercent, 'La rentabilidad anual');

  if (input.annualReturnPercent > MAX_ANNUAL_RETURN_PERCENT) {
    throw new CompoundInterestInputError(`La rentabilidad anual no puede superar el ${MAX_ANNUAL_RETURN_PERCENT} % en esta simulación.`);
  }

  if (!Number.isInteger(input.years) || input.years < 1 || input.years > MAX_YEARS) {
    throw new CompoundInterestInputError(`El plazo debe ser un número entero entre 1 y ${MAX_YEARS} años.`);
  }
}

/**
 * Simula interés compuesto con capitalización mensual.
 * Las aportaciones periódicas se añaden al final de cada mes.
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  validateInput(input);

  const months = input.years * 12;
  const monthlyRate = input.annualReturnPercent / 100 / 12;
  let totalCapital = input.initialCapital;
  const evolution: CompoundInterestYear[] = [];

  for (let month = 1; month <= months; month += 1) {
    totalCapital += totalCapital * monthlyRate;
    totalCapital += input.monthlyContribution;

    if (month % 12 === 0) {
      const contributedCapital = input.initialCapital + input.monthlyContribution * month;
      evolution.push({
        year: month / 12,
        contributedCapital,
        interestEarned: totalCapital - contributedCapital,
        totalCapital,
      });
    }
  }

  const totalContributions = input.initialCapital + input.monthlyContribution * months;

  return {
    ...input,
    months,
    totalContributions,
    interestEarned: totalCapital - totalContributions,
    finalCapital: totalCapital,
    evolution,
  };
}
