import '../styles/mortgage.css';
import { calculateLoan, type LoanInput, type LoanResult } from '../lib/calculations/loan';
import { formatEuro, formatNumber } from '../lib/formatters/currency';
import { validateLoanForm } from '../lib/validation/loan';

const form = document.querySelector<HTMLFormElement>('#loan-form');
if (!form) throw new Error('No se encontró el formulario de préstamo.');

const fields = {
  principal: form.elements.namedItem('principal') as HTMLInputElement,
  annualInterestRate: form.elements.namedItem('annualInterestRate') as HTMLInputElement,
  years: form.elements.namedItem('years') as HTMLInputElement,
  initialFee: form.elements.namedItem('initialFee') as HTMLInputElement,
};

const results = document.querySelector<HTMLElement>('#loan-results')!;
const announcement = document.querySelector<HTMLElement>('#loan-announcement')!;
const feeResult = document.querySelector<HTMLElement>('#loan-fee-result')!;
const composition = document.querySelector<HTMLElement>('#loan-composition')!;
const values = {
  monthlyPayment: document.querySelector<HTMLElement>('[data-result="monthlyPayment"]')!,
  principal: document.querySelector<HTMLElement>('[data-result="principal"]')!,
  totalInterest: document.querySelector<HTMLElement>('[data-result="totalInterest"]')!,
  interestPercentage: document.querySelector<HTMLElement>('[data-result="interestPercentage"]')!,
  totalInstallments: document.querySelector<HTMLElement>('[data-result="totalInstallments"]')!,
  initialFee: document.querySelector<HTMLElement>('[data-result="initialFee"]')!,
  totalCost: document.querySelector<HTMLElement>('[data-result="totalCost"]')!,
};

const readInput = (): LoanInput => ({
  principal: fields.principal.valueAsNumber,
  annualInterestRate: fields.annualInterestRate.valueAsNumber,
  years: fields.years.valueAsNumber,
  initialFee: fields.initialFee.value.trim() === '' ? undefined : fields.initialFee.valueAsNumber,
});

const renderComposition = (result: LoanResult): void => {
  const principalPercent = result.principal / result.totalInstallments * 100;
  const interestPercent = result.totalInterest / result.totalInstallments * 100;
  composition.innerHTML = `<div class="mortgage-bar" role="img" aria-label="Del total de cuotas, ${formatNumber(principalPercent)} % corresponde al importe inicial y ${formatNumber(interestPercent)} % a intereses."><span class="mortgage-bar-principal" style="width:${principalPercent}%"></span><span class="mortgage-bar-interest" style="width:${interestPercent}%"></span></div><div class="mortgage-legend"><span><i class="legend-principal" aria-hidden="true"></i>Importe inicial: ${formatEuro(result.principal)}</span><span><i class="legend-interest" aria-hidden="true"></i>Intereses: ${formatEuro(result.totalInterest)}</span></div>`;
};

const renderResults = (result: LoanResult): void => {
  values.monthlyPayment.textContent = formatEuro(result.monthlyPayment);
  values.principal.textContent = formatEuro(result.principal);
  values.totalInterest.textContent = formatEuro(result.totalInterest);
  values.interestPercentage.textContent = `${formatNumber(result.interestPercentageOfPrincipal)} %`;
  values.totalInstallments.textContent = formatEuro(result.totalInstallments);
  values.initialFee.textContent = formatEuro(result.initialFee ?? 0);
  values.totalCost.textContent = formatEuro(result.totalCostIncludingFee);
  feeResult.hidden = !result.initialFee;
  renderComposition(result);
  results.hidden = false;
  announcement.textContent = `Resultados actualizados. La cuota mensual estimada es ${formatEuro(result.monthlyPayment)}.`;
};

const showErrors = (errors: ReturnType<typeof validateLoanForm>): boolean => {
  let firstInvalid: HTMLInputElement | undefined;
  (Object.keys(fields) as Array<keyof typeof fields>).forEach((key) => {
    const errorElement = document.querySelector<HTMLElement>(`#${key}-error`)!;
    const message = errors[key];
    errorElement.textContent = message ?? '';
    errorElement.hidden = !message;
    fields[key].setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message && !firstInvalid) firstInvalid = fields[key];
  });
  firstInvalid?.focus();
  return Boolean(firstInvalid);
};

const calculate = (): void => {
  const input = readInput();
  const errors = validateLoanForm(input);
  if (showErrors(errors)) {
    announcement.textContent = 'Revisa los campos indicados antes de calcular.';
    return;
  }
  renderResults(calculateLoan(input));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

calculate();
