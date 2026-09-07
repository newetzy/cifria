import { calculateRentYield, type RentYieldInput } from '../lib/calculations/rent-yield';
import { formatEuro, formatNumber } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#rent-yield-form');
if (!form) throw new Error('No se encontró el formulario de rentabilidad del alquiler.');

const fields = {
  purchasePrice: form.elements.namedItem('purchasePrice') as HTMLInputElement,
  monthlyRent: form.elements.namedItem('monthlyRent') as HTMLInputElement,
  annualExpenses: form.elements.namedItem('annualExpenses') as HTMLInputElement,
};

const results = document.querySelector<HTMLElement>('#rent-yield-results')!;
const announcement = document.querySelector<HTMLElement>('#rent-yield-announcement')!;
const values = {
  grossYield: document.querySelector<HTMLElement>('[data-result="grossYield"]')!,
  netYield: document.querySelector<HTMLElement>('[data-result="netYield"]')!,
  annualRent: document.querySelector<HTMLElement>('[data-result="annualRent"]')!,
  netAnnualIncome: document.querySelector<HTMLElement>('[data-result="netAnnualIncome"]')!,
};

const calculate = (): void => {
  const input: RentYieldInput = {
    purchasePrice: fields.purchasePrice.valueAsNumber,
    monthlyRent: fields.monthlyRent.valueAsNumber,
    annualExpenses: fields.annualExpenses.valueAsNumber,
  };

  try {
    const result = calculateRentYield(input);
    values.grossYield.textContent = `${formatNumber(result.grossYield)} %`;
    values.netYield.textContent = `${formatNumber(result.netYield)} %`;
    values.annualRent.textContent = formatEuro(result.annualRent);
    values.netAnnualIncome.textContent = formatEuro(result.netAnnualIncome);
    results.hidden = false;
    announcement.textContent = `Rentabilidad bruta ${formatNumber(result.grossYield)} por ciento y neta ${formatNumber(result.netYield)} por ciento.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};

form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
