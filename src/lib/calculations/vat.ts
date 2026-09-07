export interface VatInput { amount: number; ratePercent: number; mode: 'add' | 'remove'; }
export interface VatResult { base: number; vat: number; total: number; }
export function calculateVat(input: VatInput): VatResult {
  if (!Number.isFinite(input.amount) || input.amount < 0) throw new Error('El importe no puede ser negativo.');
  if (!Number.isFinite(input.ratePercent) || input.ratePercent < 0 || input.ratePercent > 100) throw new Error('El tipo de IVA debe estar entre 0 % y 100 %.');
  const rate = input.ratePercent / 100;
  if (input.mode === 'add') { const vat = input.amount * rate; return { base: input.amount, vat, total: input.amount + vat }; }
  const total = input.amount;
  const base = rate === 0 ? total : total / (1 + rate);
  return { base, vat: total - base, total };
}
