import test from 'node:test'; import assert from 'node:assert/strict'; import { calculateIrpf, type IrpfInput } from './irpf.ts';
const input: IrpfInput = { salary: 30000, otherIncome: 0, savingsIncome: 0, socialContributions: 1905, pensionContributions: 0, withheld: 4000, age: 35, children: 0, childrenUnder3: 0, dependantsOver65: 0, disability: 'none', filing: 'individual' };
test('calcula una cuota estimada y saldo frente a retenciones', () => { const result = calculateIrpf(input); assert.ok(result.estimatedTax > 0); assert.equal(result.balance, result.estimatedTax - 4000); });
test('aplica mínimos familiares', () => { const base = calculateIrpf(input); const family = calculateIrpf({ ...input, children: 2, childrenUnder3: 1 }); assert.equal(family.personalMinimum, 13450); assert.ok(family.estimatedTax < base.estimatedTax); });
test('rechaza importes negativos y datos familiares incoherentes', () => { assert.throws(() => calculateIrpf({ ...input, salary: -1 })); assert.throws(() => calculateIrpf({ ...input, children: 1, childrenUnder3: 2 })); });
test('rechaza ascendientes negativos, fraccionarios o no finitos', () => {
  for (const dependantsOver65 of [-1, 0.5, NaN, Infinity]) {
    assert.throws(() => calculateIrpf({ ...input, dependantsOver65 }), /ascendientes/);
  }
});
test('aplica el incremento simplificado por ascendientes válidos', () => {
  const result = calculateIrpf({ ...input, dependantsOver65: 2 });
  assert.equal(result.personalMinimum, 7850);
  assert.ok(result.estimatedTax < calculateIrpf(input).estimatedTax);
});
test('conserva el cálculo de referencia sin parámetro autonómico', () => {
  const result = calculateIrpf(input);
  assert.equal(result.generalBase, 28095);
  const referenceTax = 12450 * 0.19 + 7750 * 0.24 + 7895 * 0.30 - 5550 * 0.19;
  assert.ok(Math.abs(result.estimatedTax - referenceTax) < 0.001);
});
