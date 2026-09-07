export interface RoiInput { investment: number; resultValue: number; extraCosts: number; }
export interface RoiResult { gain: number; roiPercent: number; }
export function calculateRoi(input: RoiInput): RoiResult {
  if (!Number.isFinite(input.investment) || input.investment <= 0) throw new Error('La inversión inicial debe ser mayor que 0.');
  if (!Number.isFinite(input.resultValue) || input.resultValue < 0) throw new Error('El valor final no puede ser negativo.');
  if (!Number.isFinite(input.extraCosts) || input.extraCosts < 0) throw new Error('Los costes adicionales no pueden ser negativos.');
  const gain = input.resultValue - input.investment - input.extraCosts;
  return { gain, roiPercent: gain / input.investment * 100 };
}
