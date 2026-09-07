export interface TipInput { amount: number; tipPercent: number; people: number; }
export interface TipResult { tipAmount: number; total: number; perPerson: number; }
export function calculateTip(input: TipInput): TipResult {
  if (!Number.isFinite(input.amount) || input.amount < 0) throw new Error('El importe debe ser igual o mayor que 0.');
  if (!Number.isFinite(input.tipPercent) || input.tipPercent < 0 || input.tipPercent > 100) throw new Error('La propina debe estar entre 0 % y 100 %.');
  if (!Number.isInteger(input.people) || input.people < 1) throw new Error('Debe haber al menos una persona.');
  const tipAmount = input.amount * input.tipPercent / 100;
  const total = input.amount + tipAmount;
  return { tipAmount, total, perPerson: total / input.people };
}
