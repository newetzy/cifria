export type HourlyWageInput = {
  annualGrossSalary: number;
  weeklyHours: number;
  vacationWeeks: number;
  extraAnnualHours: number;
};

export type HourlyWageResult = HourlyWageInput & {
  workingWeeks: number;
  annualHours: number;
  hourlyGross: number;
  monthlyGrossAverage: number;
};

export function calculateHourlyWage(input: HourlyWageInput): HourlyWageResult {
  if (!Number.isFinite(input.annualGrossSalary) || input.annualGrossSalary < 0) throw new RangeError('El salario bruto anual debe ser igual o mayor que 0.');
  if (!Number.isFinite(input.weeklyHours) || input.weeklyHours <= 0 || input.weeklyHours > 80) throw new RangeError('Las horas semanales deben estar entre 0 y 80.');
  if (!Number.isFinite(input.vacationWeeks) || input.vacationWeeks < 0 || input.vacationWeeks >= 52) throw new RangeError('Las semanas de vacaciones deben estar entre 0 y 51.');
  if (!Number.isFinite(input.extraAnnualHours) || input.extraAnnualHours < 0) throw new RangeError('Las horas adicionales deben ser igual o mayores que 0.');

  const workingWeeks = 52 - input.vacationWeeks;
  const annualHours = workingWeeks * input.weeklyHours + input.extraAnnualHours;
  if (annualHours <= 0) throw new RangeError('El total de horas anuales debe ser mayor que 0.');

  return {
    ...input,
    workingWeeks,
    annualHours,
    hourlyGross: input.annualGrossSalary / annualHours,
    monthlyGrossAverage: input.annualGrossSalary / 12,
  };
}
