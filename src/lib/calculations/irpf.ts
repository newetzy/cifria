import { irpf2025, type AutonomousCommunity, type TaxBracket } from '../../data/tax/irpf-2025.ts';
export type { AutonomousCommunity } from '../../data/tax/irpf-2025.ts';

export interface IrpfInput {
  salary: number; otherIncome: number; savingsIncome: number; socialContributions: number; withheld: number;
  age: number; disability: 'none' | '33' | '65'; community: AutonomousCommunity;
}
export interface IrpfResult {
  generalBase: number; savingsBase: number; personalMinimum: number;
  stateTax: number; autonomousTax: number; savingsTax: number; estimatedTax: number;
  withheld: number; balance: number; effectiveRate: number;
}

function tax(base: number, scale: readonly TaxBracket[]) {
  let result = 0; let previous = 0;
  for (const [limit, rate] of scale) {
    result += Math.max(0, Math.min(base, limit) - previous) * rate;
    previous = limit;
    if (base <= limit) break;
  }
  return result;
}
function validAmount(value: number) { return Number.isFinite(value) && value >= 0; }

/** Simplified 2025 estimate; it deliberately does not calculate a full tax return. */
export function calculateIrpf(input: IrpfInput): IrpfResult {
  for (const value of [input.salary, input.otherIncome, input.savingsIncome, input.socialContributions, input.withheld]) {
    if (!validAmount(value)) throw new Error('El importe debe ser un número igual o mayor que cero.');
  }
  if (!irpf2025.autonomous[input.community]) throw new Error('Selecciona una comunidad autónoma válida.');
  if (!Number.isInteger(input.age) || input.age < 18 || input.age > 120) throw new Error('Introduce una edad válida.');
  if (!['none', '33', '65'].includes(input.disability)) throw new Error('Selecciona una discapacidad válida.');

  const generalBase = Math.max(0, input.salary + input.otherIncome - input.socialContributions);
  const savingsBase = input.savingsIncome;
  const minimum = irpf2025.personalMinimum;
  const personalMinimum = minimum.base + (input.age >= 65 ? minimum.over65 : 0) + (input.age >= 75 ? minimum.over75 : 0)
    + (input.disability === '33' ? minimum.disability33 : input.disability === '65' ? minimum.disability65 : 0);
  const minimumApplied = Math.min(generalBase, personalMinimum);
  const stateGeneral = Math.max(0, tax(generalBase, irpf2025.stateGeneral) - tax(minimumApplied, irpf2025.stateGeneral));
  const autonomousGeneral = Math.max(0, tax(generalBase, irpf2025.autonomous[input.community]) - tax(minimumApplied, irpf2025.autonomous[input.community]));
  const savingsTax = tax(savingsBase, irpf2025.savingsCombined);
  // The AEAT combined savings scale is the sum of equal state and autonomous halves.
  const stateTax = stateGeneral + savingsTax / 2;
  const autonomousTax = autonomousGeneral + savingsTax / 2;
  const estimatedTax = stateTax + autonomousTax;

  return { generalBase, savingsBase, personalMinimum, stateTax, autonomousTax, savingsTax, estimatedTax, withheld: input.withheld,
    balance: estimatedTax - input.withheld, effectiveRate: (generalBase + savingsBase) ? estimatedTax / (generalBase + savingsBase) * 100 : 0 };
}
