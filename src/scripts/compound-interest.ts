import '../styles/compound-interest.css';
import { calculateCompoundInterest, type CompoundInterestInput, type CompoundInterestResult } from '../lib/calculations/compound-interest';
import { formatEuro, formatNumber } from '../lib/formatters/currency';
import { validateCompoundInterestForm } from '../lib/validation/compound-interest';

const form = document.querySelector<HTMLFormElement>('#compound-interest-form');

if (!form) throw new Error('No se encontró el formulario de interés compuesto.');

const fields = {
  initialCapital: form.elements.namedItem('initialCapital') as HTMLInputElement,
  monthlyContribution: form.elements.namedItem('monthlyContribution') as HTMLInputElement,
  annualReturnPercent: form.elements.namedItem('annualReturnPercent') as HTMLInputElement,
  years: form.elements.namedItem('years') as HTMLInputElement,
};

const results = document.querySelector<HTMLElement>('#compound-results')!;
const announcement = document.querySelector<HTMLElement>('#calculator-announcement')!;
const chart = document.querySelector<HTMLElement>('#compound-chart')!;
const tableBody = document.querySelector<HTMLTableSectionElement>('#compound-table-body')!;
const values = {
  initialCapital: document.querySelector<HTMLElement>('[data-result="initialCapital"]')!,
  totalContributions: document.querySelector<HTMLElement>('[data-result="totalContributions"]')!,
  interestEarned: document.querySelector<HTMLElement>('[data-result="interestEarned"]')!,
  finalCapital: document.querySelector<HTMLElement>('[data-result="finalCapital"]')!,
};

const readInput = (): CompoundInterestInput => ({
  initialCapital: fields.initialCapital.valueAsNumber,
  monthlyContribution: fields.monthlyContribution.valueAsNumber,
  annualReturnPercent: fields.annualReturnPercent.valueAsNumber,
  years: fields.years.valueAsNumber,
});

const drawPath = (points: number[], maxValue: number): string => {
  const width = 640;
  const height = 230;
  const padding = 16;
  const xStep = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  return points.map((value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
};

const renderChart = (result: CompoundInterestResult): void => {
  const totalCapital = result.evolution.map(({ totalCapital: value }) => value);
  const contributedCapital = result.evolution.map(({ contributedCapital: value }) => value);
  const maximum = Math.max(...totalCapital, ...contributedCapital, 1);
  const totalPath = drawPath(totalCapital, maximum);
  const contributedPath = drawPath(contributedCapital, maximum);
  const finalYear = result.evolution.at(-1)?.year ?? result.years;

  chart.innerHTML = `<svg viewBox="0 0 640 230" role="img" aria-labelledby="compound-chart-title compound-chart-description"><title id="compound-chart-title">Evolución del capital durante ${finalYear} años</title><desc id="compound-chart-description">El capital final estimado es ${formatEuro(result.finalCapital)} y el dinero aportado es ${formatEuro(result.totalContributions)}.</desc><path class="chart-grid-line" d="M 16 214 H 624" /><path class="chart-contributions-line" d="${contributedPath}" /><path class="chart-total-line" d="${totalPath}" /></svg>`;
};

const renderTable = (result: CompoundInterestResult): void => {
  tableBody.innerHTML = result.evolution.map((point) => `<tr><th scope="row">${point.year}</th><td>${formatEuro(point.contributedCapital)}</td><td>${formatEuro(point.interestEarned)}</td><td>${formatEuro(point.totalCapital)}</td></tr>`).join('');
};

const renderResults = (result: CompoundInterestResult): void => {
  values.initialCapital.textContent = formatEuro(result.initialCapital);
  values.totalContributions.textContent = formatEuro(result.totalContributions);
  values.interestEarned.textContent = formatEuro(result.interestEarned);
  values.finalCapital.textContent = formatEuro(result.finalCapital);
  renderChart(result);
  renderTable(result);
  results.hidden = false;
  announcement.textContent = `Resultados actualizados. Capital final estimado: ${formatEuro(result.finalCapital)} tras ${formatNumber(result.years)} años.`;
};

const showErrors = (errors: ReturnType<typeof validateCompoundInterestForm>): boolean => {
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
  const errors = validateCompoundInterestForm(input);
  if (showErrors(errors)) {
    announcement.textContent = 'Revisa los campos indicados antes de calcular.';
    return;
  }
  renderResults(calculateCompoundInterest(input));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

calculate();
