import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCostPerKm } from './cost-per-km.ts';

test('calcula combustible y coste por kilometro', () => {
  const result = calculateCostPerKm({ distanceKm: 100, fuelLitresPer100Km: 5, fuelPricePerLitre: 1.5, fixedCostPerYear: 0, annualKm: 10000 });
  assert.equal(result.fuelCostPerTrip, 7.5);
  assert.equal(result.costPerKm, 0.075);
});

test('anade costes fijos prorrateados', () => {
  const result = calculateCostPerKm({ distanceKm: 100, fuelLitresPer100Km: 5, fuelPricePerLitre: 1.5, fixedCostPerYear: 1000, annualKm: 10000 });
  assert.equal(result.costPerKm, 0.175);
});
