import '../styles/compound-interest.css';
import { calculateVat, type VatInput } from '../lib/calculations/vat';
import { formatEuro } from '../lib/formatters/currency';
const form = document.querySelector<HTMLFormElement>('#vat-form');
if (!form) throw new Error('No se encontro el formulario de IVA.');
const fields = { amount: form.querySelector<HTMLInputElement>('#amount')!, ratePercent: form.querySelector<HTMLSelectElement>('#ratePercent')!, mode: form.querySelector<HTMLSelectElement>('#mode')! };
const results = document.querySelector<HTMLElement>('#vat-results')!;
const announcement = document.querySelector<HTMLElement>('#vat-announcement')!;
const values = { base: document.querySelector<HTMLElement>('[data-result="base"]')!, vat: document.querySelector<HTMLElement>('[data-result="vat"]')!, total: document.querySelector<HTMLElement>('[data-result="total"]')! };
const calculate = () => {
  const input: VatInput = { amount: fields.amount.valueAsNumber, ratePercent: Number(fields.ratePercent.value), mode: fields.mode.value as VatInput['mode'] };
  try { const result = calculateVat(input); values.base.textContent = formatEuro(result.base); values.vat.textContent = formatEuro(result.vat); values.total.textContent = formatEuro(result.total); results.hidden = false; announcement.textContent = `Precio final: ${formatEuro(result.total)}.`; }
  catch (error) { announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.'; }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
