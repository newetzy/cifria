import '../styles/compound-interest.css';
import { calculateSimpleInterest, type SimpleInterestInput } from '../lib/calculations/simple-interest';
import { formatEuro } from '../lib/formatters/currency';
const form = document.querySelector<HTMLFormElement>('#simple-interest-form');
if (!form) throw new Error('No se encontro el formulario de interes simple.');
const fields = { principal: form.querySelector<HTMLInputElement>('#principal')!, annualRatePercent: form.querySelector<HTMLInputElement>('#annualRatePercent')!, years: form.querySelector<HTMLInputElement>('#years')! };
const results = document.querySelector<HTMLElement>('#simple-interest-results')!;
const announcement = document.querySelector<HTMLElement>('#simple-interest-announcement')!;
const interest = document.querySelector<HTMLElement>('[data-result="interest"]')!;
const finalAmount = document.querySelector<HTMLElement>('[data-result="finalAmount"]')!;
const calculate = () => {
  const input: SimpleInterestInput = { principal: fields.principal.valueAsNumber, annualRatePercent: fields.annualRatePercent.valueAsNumber, years: fields.years.valueAsNumber };
  try { const result = calculateSimpleInterest(input); interest.textContent = formatEuro(result.interest); finalAmount.textContent = formatEuro(result.finalAmount); results.hidden = false; announcement.textContent = `Capital final: ${formatEuro(result.finalAmount)}.`; }
  catch (error) { announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.'; }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
