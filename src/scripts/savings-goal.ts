import { calculateSavingsGoal, type SavingsGoalInput } from '../lib/calculations/savings-goal';
import { formatEuro, formatNumber } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#savings-goal-form');
if (!form) throw new Error('No se encontró el formulario de objetivo de ahorro.');
const fields = {
  initialCapital: form.elements.namedItem('initialCapital') as HTMLInputElement,
  monthlyContribution: form.elements.namedItem('monthlyContribution') as HTMLInputElement,
  annualReturnPercent: form.elements.namedItem('annualReturnPercent') as HTMLInputElement,
  targetAmount: form.elements.namedItem('targetAmount') as HTMLInputElement,
};
const results = document.querySelector<HTMLElement>('#savings-goal-results')!;
const announcement = document.querySelector<HTMLElement>('#savings-goal-announcement')!;
const values = {
  time: document.querySelector<HTMLElement>('[data-result="time"]')!,
  finalCapital: document.querySelector<HTMLElement>('[data-result="finalCapital"]')!,
  investedCapital: document.querySelector<HTMLElement>('[data-result="investedCapital"]')!,
  interest: document.querySelector<HTMLElement>('[data-result="interest"]')!,
};

const calculate = (): void => {
  const input: SavingsGoalInput = {
    initialCapital: fields.initialCapital.valueAsNumber,
    monthlyContribution: fields.monthlyContribution.valueAsNumber,
    annualReturnPercent: fields.annualReturnPercent.valueAsNumber,
    targetAmount: fields.targetAmount.valueAsNumber,
  };
  try {
    const result = calculateSavingsGoal(input);
    values.time.textContent = result.months < 12 ? `${result.months} meses` : `${Math.floor(result.months / 12)} años y ${result.months % 12} meses`;
    values.finalCapital.textContent = formatEuro(result.finalCapital);
    values.investedCapital.textContent = formatEuro(result.investedCapital);
    values.interest.textContent = formatEuro(result.estimatedInterest);
    results.hidden = false;
    announcement.textContent = `Objetivo alcanzado en ${formatNumber(result.months)} meses.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
