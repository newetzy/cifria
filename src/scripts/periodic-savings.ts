import '../styles/compound-interest.css';
import { calculatePeriodicSavings, type PeriodicSavingsInput } from '../lib/calculations/periodic-savings';
import { formatEuro } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#periodic-savings-form');
if (!form) throw new Error('No se encontro el formulario de aportaciones periódicas.');
const fields = {
  initialCapital: form.querySelector<HTMLInputElement>('#initialCapital')!,
  monthlyContribution: form.querySelector<HTMLInputElement>('#monthlyContribution')!,
  annualRatePercent: form.querySelector<HTMLInputElement>('#annualRatePercent')!,
  years: form.querySelector<HTMLInputElement>('#years')!,
};
const results = document.querySelector<HTMLElement>('#periodic-savings-results')!;
const announcement = document.querySelector<HTMLElement>('#periodic-savings-announcement')!;
const values = {
  finalCapital: document.querySelector<HTMLElement>('[data-result="finalCapital"]')!,
  contributedCapital: document.querySelector<HTMLElement>('[data-result="contributedCapital"]')!,
  interestEarned: document.querySelector<HTMLElement>('[data-result="interestEarned"]')!,
};
const calculate = () => {
  const input: PeriodicSavingsInput = {
    initialCapital: fields.initialCapital.valueAsNumber,
    monthlyContribution: fields.monthlyContribution.valueAsNumber,
    annualRatePercent: fields.annualRatePercent.valueAsNumber,
    years: fields.years.valueAsNumber,
  };
  try {
    const result = calculatePeriodicSavings(input);
    values.finalCapital.textContent = formatEuro(result.finalCapital);
    values.contributedCapital.textContent = formatEuro(result.contributedCapital);
    values.interestEarned.textContent = formatEuro(result.interestEarned);
    results.hidden = false;
    announcement.textContent = `Capital final estimado: ${formatEuro(result.finalCapital)}.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
