import { calculateHourlyWage, type HourlyWageInput } from '../lib/calculations/hourly-wage';
import { formatEuro, formatNumber } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#hourly-wage-form');
if (!form) throw new Error('No se encontró el formulario de salario por hora.');
const fields = {
  annualGrossSalary: form.elements.namedItem('annualGrossSalary') as HTMLInputElement,
  weeklyHours: form.elements.namedItem('weeklyHours') as HTMLInputElement,
  vacationWeeks: form.elements.namedItem('vacationWeeks') as HTMLInputElement,
  extraAnnualHours: form.elements.namedItem('extraAnnualHours') as HTMLInputElement,
};
const results = document.querySelector<HTMLElement>('#hourly-wage-results')!;
const announcement = document.querySelector<HTMLElement>('#hourly-wage-announcement')!;
const values = {
  hourlyGross: document.querySelector<HTMLElement>('[data-result="hourlyGross"]')!,
  annualHours: document.querySelector<HTMLElement>('[data-result="annualHours"]')!,
  workingWeeks: document.querySelector<HTMLElement>('[data-result="workingWeeks"]')!,
  monthlyGrossAverage: document.querySelector<HTMLElement>('[data-result="monthlyGrossAverage"]')!,
};
const calculate = (): void => {
  const input: HourlyWageInput = {
    annualGrossSalary: fields.annualGrossSalary.valueAsNumber,
    weeklyHours: fields.weeklyHours.valueAsNumber,
    vacationWeeks: fields.vacationWeeks.valueAsNumber,
    extraAnnualHours: fields.extraAnnualHours.valueAsNumber,
  };
  try {
    const result = calculateHourlyWage(input);
    values.hourlyGross.textContent = formatEuro(result.hourlyGross);
    values.annualHours.textContent = `${formatNumber(result.annualHours)} h`;
    values.workingWeeks.textContent = `${formatNumber(result.workingWeeks)} semanas`;
    values.monthlyGrossAverage.textContent = formatEuro(result.monthlyGrossAverage);
    results.hidden = false;
    announcement.textContent = `Tu salario bruto estimado es ${formatEuro(result.hourlyGross)} por hora.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
