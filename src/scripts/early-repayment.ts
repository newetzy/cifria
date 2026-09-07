import '../styles/compound-interest.css';
import { calculateEarlyRepayment, type EarlyRepaymentInput } from '../lib/calculations/early-repayment';
import { formatEuro, formatNumber } from '../lib/formatters/currency';
const form = document.querySelector<HTMLFormElement>('#early-repayment-form');
if (!form) throw new Error('No se encontro el formulario de amortizacion.');
const fields = { principal: form.querySelector<HTMLInputElement>('#principal')!, annualRatePercent: form.querySelector<HTMLInputElement>('#annualRatePercent')!, remainingYears: form.querySelector<HTMLInputElement>('#remainingYears')!, extraPayment: form.querySelector<HTMLInputElement>('#extraPayment')!, mode: form.querySelector<HTMLSelectElement>('#mode')! };
const results = document.querySelector<HTMLElement>('#early-repayment-results')!;
const announcement = document.querySelector<HTMLElement>('#early-repayment-announcement')!;
const values = { oldPayment: document.querySelector<HTMLElement>('[data-result="oldPayment"]')!, newPayment: document.querySelector<HTMLElement>('[data-result="newPayment"]')!, interestSaved: document.querySelector<HTMLElement>('[data-result="interestSaved"]')!, monthsSaved: document.querySelector<HTMLElement>('[data-result="monthsSaved"]')! };
const calculate = () => {
  const input: EarlyRepaymentInput = { principal: fields.principal.valueAsNumber, annualRatePercent: fields.annualRatePercent.valueAsNumber, remainingYears: fields.remainingYears.valueAsNumber, extraPayment: fields.extraPayment.valueAsNumber, mode: fields.mode.value as EarlyRepaymentInput['mode'] };
  try { const result = calculateEarlyRepayment(input); values.oldPayment.textContent = formatEuro(result.oldPayment); values.newPayment.textContent = formatEuro(result.newPayment); values.interestSaved.textContent = formatEuro(result.interestSaved); values.monthsSaved.textContent = `${formatNumber(result.monthsSaved)} meses`; results.hidden = false; announcement.textContent = `Ahorro estimado de intereses: ${formatEuro(result.interestSaved)}.`; }
  catch (error) { announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.'; }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
