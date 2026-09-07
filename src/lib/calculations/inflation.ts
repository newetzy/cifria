export type InflationInput = {
  amount: number;
  annualInflationPercent: number;
  years: number;
};

export type InflationResult = InflationInput & {
  futureCost: number;
  purchasingPower: number;
  lossPercent: number;
};

export function calculateInflation(input: InflationInput): InflationResult {
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new RangeError('El importe debe ser mayor que 0.');
  if (!Number.isFinite(input.annualInflationPercent) || input.annualInflationPercent < 0 || input.annualInflationPercent > 100) throw new RangeError('La inflación anual debe estar entre 0 % y 100 %.');
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > 100) throw new RangeError('El plazo debe ser un número entero entre 1 y 100 años.');

  const multiplier = Math.pow(1 + input.annualInflationPercent / 100, input.years);
  const futureCost = input.amount * multiplier;
  const purchasingPower = input.amount / multiplier;
  const lossPercent = (1 - 1 / multiplier) * 100;

  return { ...input, futureCost, purchasingPower, lossPercent };
}
