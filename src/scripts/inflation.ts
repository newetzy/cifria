import { calculateInflation, type InflationInput } from '../lib/calculations/inflation';
import { formatEuro, formatNumber } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#inflation-form');
if (!form) throw new Error('No se encontró el formulario de inflación.');
const fields = {
  amount: form.elements.namedItem('amount') as HTMLInputElement,
  annualInflationPercent: form.elements.namedItem('annualInflationPercent') as HTMLInputElement,
  years: form.elements.namedItem('years') as HTMLInputElement,
};
const results = document.querySelector<HTMLElement>('#inflation-results')!;
const announcement = document.querySelector<HTMLElement>('#inflation-announcement')!;
const values = {
  futureCost: document.querySelector<HTMLElement>('[data-result="futureCost"]')!,
  purchasingPower: document.querySelector<HTMLElement>('[data-result="purchasingPower"]')!,
  lossPercent: document.querySelector<HTMLElement>('[data-result="lossPercent"]')!,
};
const calculate = (): void => {
  const input: InflationInput = { amount: fields.amount.valueAsNumber, annualInflationPercent: fields.annualInflationPercent.valueAsNumber, years: fields.years.valueAsNumber };
  try {
    const result = calculateInflation(input);
    values.futureCost.textContent = formatEuro(result.futureCost);
    values.purchasingPower.textContent = formatEuro(result.purchasingPower);
    values.lossPercent.textContent = `${formatNumber(result.lossPercent)} %`;
    results.hidden = false;
    announcement.textContent = `El coste futuro estimado es ${formatEuro(result.futureCost)}.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
