export interface PercentageInput { percentage: number; value: number; }
export interface PercentageResult { amount: number; total: number; }
export function calculatePercentage(input: PercentageInput): PercentageResult {
  if (!Number.isFinite(input.percentage) || input.percentage < 0) throw new Error('El porcentaje no puede ser negativo.');
  if (!Number.isFinite(input.value) || input.value < 0) throw new Error('El valor debe ser igual o mayor que 0.');
  const amount = (input.percentage / 100) * input.value;
  return { amount, total: input.value + amount };
}
