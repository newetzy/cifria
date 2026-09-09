export type TaxRegion = 'andalucia' | 'aragon' | 'asturias' | 'baleares' | 'canarias' | 'cantabria' | 'castilla-la-mancha' | 'castilla-y-leon' | 'cataluna' | 'extremadura' | 'galicia' | 'madrid' | 'murcia' | 'navarra' | 'pais-vasco' | 'rioja' | 'valencia';
export interface IrpfInput { salary: number; otherIncome: number; savingsIncome: number; socialContributions: number; pensionContributions: number; withheld: number; age: number; children: number; childrenUnder3: number; dependantsOver65: number; disability: 'none' | '33' | '65'; filing: 'individual' | 'joint'; region: TaxRegion; }
export interface IrpfResult { generalBase: number; savingsBase: number; personalMinimum: number; generalTax: number; savingsTax: number; estimatedTax: number; withheld: number; balance: number; effectiveRate: number; }
const brackets: Array<[number, number]> = [[12450, .19], [20200, .24], [35200, .30], [60000, .37], [300000, .45], [Infinity, .47]];
const savingsBrackets: Array<[number, number]> = [[6000, .19], [50000, .21], [200000, .23], [300000, .27], [Infinity, .30]];
function nonNegative(value: number, name: string) { if (!Number.isFinite(value) || value < 0) throw new Error(`${name} debe ser un número igual o mayor que cero.`); return value; }
function progressiveTax(base: number, scale: Array<[number, number]>) { let tax = 0, previous = 0, rest = base; for (const [limit, rate] of scale) { const slice = Math.min(rest, limit - previous); if (slice > 0) tax += slice * rate; rest -= slice; previous = limit; if (rest <= 0) break; } return tax; }
export function calculateIrpf(input: IrpfInput): IrpfResult {
  const values = [input.salary, input.otherIncome, input.savingsIncome, input.socialContributions, input.pensionContributions, input.withheld]; values.forEach((value) => nonNegative(value, 'El importe'));
  if (!Number.isInteger(input.age) || input.age < 18 || input.age > 120) throw new Error('Introduce una edad válida.');
  if (!Number.isInteger(input.children) || input.children < 0 || !Number.isInteger(input.childrenUnder3) || input.childrenUnder3 < 0 || input.childrenUnder3 > input.children) throw new Error('Revisa los datos de descendientes.');
  const generalBase = Math.max(0, input.salary + input.otherIncome - input.socialContributions - Math.min(input.pensionContributions, 1500) - (input.filing === 'joint' ? 3400 : 0));
  const savingsBase = input.savingsIncome;
  let personalMinimum = 5550 + (input.age >= 65 ? 1150 : 0) + (input.age >= 75 ? 1400 : 0);
  const childAmounts = [2400, 2700, 4000]; for (let index = 0; index < input.children; index++) personalMinimum += childAmounts[index] ?? 4500; personalMinimum += input.childrenUnder3 * 2800 + input.dependantsOver65 * 1150;
  if (input.disability === '33') personalMinimum += 3000; if (input.disability === '65') personalMinimum += 12000;
  const generalTax = Math.max(0, progressiveTax(generalBase, brackets) - progressiveTax(Math.min(generalBase, personalMinimum), brackets));
  const savingsTax = progressiveTax(savingsBase, savingsBrackets);
  const estimatedTax = generalTax + savingsTax;
  return { generalBase, savingsBase, personalMinimum, generalTax, savingsTax, estimatedTax, withheld: input.withheld, balance: estimatedTax - input.withheld, effectiveRate: (generalBase + savingsBase) === 0 ? 0 : estimatedTax / (generalBase + savingsBase) * 100 };
}
