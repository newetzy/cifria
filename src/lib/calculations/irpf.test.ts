import test from 'node:test';
import assert from 'node:assert/strict';
import { irpf2025, type TaxBracket } from '../../data/tax/irpf-2025.ts';
import { calculateIrpf, type IrpfInput } from './irpf.ts';

const input: IrpfInput = { salary: 30000, otherIncome: 0, savingsIncome: 0, socialContributions: 1905, withheld: 4000, age: 35, disability: 'none', community: 'castilla-la-mancha' };
const tax = (base: number, scale: readonly TaxBracket[]) => {
  let total = 0; let lower = 0;
  for (const [upper, rate] of scale) { total += Math.max(0, Math.min(base, upper) - lower) * rate; lower = upper; if (base <= upper) break; }
  return total;
};

test('versiona explícitamente el ejercicio 2025 y la campaña 2026', () => {
  assert.equal(irpf2025.exercise, 2025); assert.equal(irpf2025.campaign, 2026);
  assert.deepEqual(irpf2025.stateGeneral, [[12450, .095], [20200, .12], [35200, .15], [60000, .185], [300000, .225], [Infinity, .245]]);
});
test('aplica la escala estatal oficial de 2025 y el mínimo personal básico', () => {
  const result = calculateIrpf(input); const base = 28095;
  assert.equal(result.generalBase, base); assert.equal(result.personalMinimum, 5550);
  assert.equal(result.stateTax, tax(base, irpf2025.stateGeneral) - tax(5550, irpf2025.stateGeneral));
});
test('usa de forma independiente la escala oficial de cada uno de los 16 territorios', () => {
  for (const [community, scale] of Object.entries(irpf2025.autonomous)) {
    const result = calculateIrpf({ ...input, community: community as IrpfInput['community'] });
    const expected = tax(result.generalBase, scale) - tax(result.personalMinimum, scale);
    assert.equal(result.autonomousTax, expected, community);
  }
  assert.equal(Object.keys(irpf2025.autonomous).length, 16);
});
test('respeta los límites exactos de cada escala autonómica', () => {
  for (const [community, scale] of Object.entries(irpf2025.autonomous)) {
    for (const [limit] of scale.slice(0, -1)) {
      const atLimit = calculateIrpf({ ...input, salary: limit, socialContributions: 0, community: community as IrpfInput['community'] });
      const nextEuro = calculateIrpf({ ...input, salary: limit + 1, socialContributions: 0, community: community as IrpfInput['community'] });
      assert.ok(Math.abs((nextEuro.autonomousTax - atLimit.autonomousTax) - (tax(limit + 1, scale) - tax(limit, scale))) < 1e-9, `${community} ${limit}`);
    }
  }
});
test('requiere una comunidad existente, sin aplicar una por defecto', () => {
  assert.throws(() => calculateIrpf({ ...input, community: '' as IrpfInput['community'] }), /comunidad autónoma válida/);
  assert.throws(() => calculateIrpf({ ...input, community: 'navarra' as IrpfInput['community'] }), /comunidad autónoma válida/);
});
test('aplica solo los mínimos personales que permiten los datos solicitados', () => {
  assert.equal(calculateIrpf({ ...input, age: 65 }).personalMinimum, 6700);
  assert.equal(calculateIrpf({ ...input, age: 75 }).personalMinimum, 8100);
  assert.equal(calculateIrpf({ ...input, disability: '33' }).personalMinimum, 8550);
  assert.equal(calculateIrpf({ ...input, disability: '65' }).personalMinimum, 14550);
  assert.equal(irpf2025.scope.familyMinimums, false);
  assert.equal(irpf2025.scope.autonomousMinimumVariations, false);
});
test('no deduce aportaciones a pensiones sin los datos necesarios', () => {
  assert.equal(irpf2025.scope.individualPensionReduction, false);
  assert.equal(calculateIrpf(input).generalBase, 28095);
});
test('separa componentes estatal y autonómico, incluido el ahorro, y conserva el total', () => {
  const result = calculateIrpf({ ...input, savingsIncome: 50000 });
  assert.equal(result.savingsTax, 6000 * .19 + 44000 * .21);
  assert.equal(result.estimatedTax, result.stateTax + result.autonomousTax);
  assert.equal(result.stateTax - (tax(result.generalBase, irpf2025.stateGeneral) - tax(result.personalMinimum, irpf2025.stateGeneral)), result.savingsTax / 2);
});
test('rechaza importes, edad y discapacidad inválidos', () => {
  assert.throws(() => calculateIrpf({ ...input, salary: -1 }));
  assert.throws(() => calculateIrpf({ ...input, age: 17 }));
  assert.throws(() => calculateIrpf({ ...input, disability: 'otro' as IrpfInput['disability'] }));
});
