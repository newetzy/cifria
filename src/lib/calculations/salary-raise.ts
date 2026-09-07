export interface SalaryRaiseInput { currentSalary: number; raisePercent: number; }
export interface SalaryRaiseResult { increase: number; newSalary: number; monthlyIncrease: number; }
export function calculateSalaryRaise(input: SalaryRaiseInput): SalaryRaiseResult {
  if (!Number.isFinite(input.currentSalary) || input.currentSalary < 0) throw new Error('El salario debe ser igual o mayor que 0.');
  if (!Number.isFinite(input.raisePercent) || input.raisePercent < -100) throw new Error('La variación no puede reducir el salario por debajo de cero.');
  const increase = input.currentSalary * input.raisePercent / 100;
  const newSalary = input.currentSalary + increase;
  return { increase, newSalary, monthlyIncrease: increase / 12 };
}
