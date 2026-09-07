export interface RentYieldInput { purchasePrice: number; monthlyRent: number; annualExpenses: number; }
export interface RentYieldResult { grossYield: number; netYield: number; annualRent: number; netAnnualIncome: number; }
export function calculateRentYield(input: RentYieldInput): RentYieldResult {
  if (!Number.isFinite(input.purchasePrice) || input.purchasePrice <= 0) throw new Error('El precio de compra debe ser mayor que 0.');
  if (!Number.isFinite(input.monthlyRent) || input.monthlyRent < 0) throw new Error('El alquiler mensual no puede ser negativo.');
  if (!Number.isFinite(input.annualExpenses) || input.annualExpenses < 0) throw new Error('Los gastos anuales no pueden ser negativos.');
  const annualRent = input.monthlyRent * 12;
  const netAnnualIncome = annualRent - input.annualExpenses;
  return { grossYield: annualRent / input.purchasePrice * 100, netYield: netAnnualIncome / input.purchasePrice * 100, annualRent, netAnnualIncome };
}
