import '../styles/mortgage.css';
import { calculateMortgage, type MortgageInput, type MortgageResult } from '../lib/calculations/mortgage';
import { formatEuro, formatNumber } from '../lib/formatters/currency';
import { validateMortgageForm } from '../lib/validation/mortgage';

const form = document.querySelector<HTMLFormElement>('#mortgage-form');
if (!form) throw new Error('No se encontró el formulario de hipoteca.');

const fields = {
  propertyPrice: form.elements.namedItem('propertyPrice') as HTMLInputElement,
  downPayment: form.elements.namedItem('downPayment') as HTMLInputElement,
  annualInterestRate: form.elements.namedItem('annualInterestRate') as HTMLInputElement,
  years: form.elements.namedItem('years') as HTMLInputElement,
  monthlyNetIncome: form.elements.namedItem('monthlyNetIncome') as HTMLInputElement,
};

const results = document.querySelector<HTMLElement>('#mortgage-results')!;
const announcement = document.querySelector<HTMLElement>('#mortgage-announcement')!;
const incomeRatio = document.querySelector<HTMLElement>('#income-ratio')!;
const composition = document.querySelector<HTMLElement>('#mortgage-composition')!;
const values = {
  monthlyPayment: document.querySelector<HTMLElement>('[data-result="monthlyPayment"]')!,
  financedAmount: document.querySelector<HTMLElement>('[data-result="financedAmount"]')!,
  totalInterest: document.querySelector<HTMLElement>('[data-result="totalInterest"]')!,
  totalLoanCost: document.querySelector<HTMLElement>('[data-result="totalLoanCost"]')!,
  totalPaid: document.querySelector<HTMLElement>('[data-result="totalPaid"]')!,
  loanToValue: document.querySelector<HTMLElement>('[data-result="loanToValue"]')!,
  incomeRatio: document.querySelector<HTMLElement>('[data-result="incomeRatio"]')!,
};

const readInput = (): MortgageInput => {
  const incomeIsEmpty = fields.monthlyNetIncome.value.trim() === '';
  return {
    propertyPrice: fields.propertyPrice.valueAsNumber,
    downPayment: fields.downPayment.valueAsNumber,
    annualInterestRate: fields.annualInterestRate.valueAsNumber,
    years: fields.years.valueAsNumber,
    monthlyNetIncome: incomeIsEmpty ? undefined : fields.monthlyNetIncome.valueAsNumber,
  };
};

const renderComposition = (result: MortgageResult): void => {
  const principalPercent = result.financedAmount / result.totalPaid * 100;
  const interestPercent = result.totalInterest / result.totalPaid * 100;
  composition.innerHTML = `<div class="mortgage-bar" role="img" aria-label="Del total pagado, ${formatNumber(principalPercent)} % corresponde al capital financiado y ${formatNumber(interestPercent)} % a intereses."><span class="mortgage-bar-principal" style="width:${principalPercent}%"></span><span class="mortgage-bar-interest" style="width:${interestPercent}%"></span></div><div class="mortgage-legend"><span><i class="legend-principal" aria-hidden="true"></i>Capital: ${formatEuro(result.financedAmount)}</span><span><i class="legend-interest" aria-hidden="true"></i>Intereses: ${formatEuro(result.totalInterest)}</span></div>`;
};

const renderResults = (result: MortgageResult): void => {
  values.monthlyPayment.textContent = formatEuro(result.monthlyPayment);
  values.financedAmount.textContent = formatEuro(result.financedAmount);
  values.totalInterest.textContent = formatEuro(result.totalInterest);
  values.totalLoanCost.textContent = formatEuro(result.totalLoanCost);
  values.totalPaid.textContent = formatEuro(result.totalPaid);
  values.loanToValue.textContent = `${formatNumber(result.loanToValuePercent)} %`;
  incomeRatio.hidden = result.paymentToIncomePercent === undefined;
  if (result.paymentToIncomePercent !== undefined) values.incomeRatio.textContent = `${formatNumber(result.paymentToIncomePercent)} %`;
  renderComposition(result);
  results.hidden = false;
  announcement.textContent = `Resultados actualizados. La cuota mensual estimada es ${formatEuro(result.monthlyPayment)}.`;
};

const showErrors = (errors: ReturnType<typeof validateMortgageForm>): boolean => {
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
  const errors = validateMortgageForm(input);
  if (showErrors(errors)) {
    announcement.textContent = 'Revisa los campos indicados antes de calcular.';
    return;
  }
  renderResults(calculateMortgage(input));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

calculate();
