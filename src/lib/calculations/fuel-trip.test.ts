import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFuelTrip } from './fuel-trip.ts';

test('calcula coste de combustible y peajes', () => {
  const result = calculateFuelTrip({ distanceKm: 500, consumptionLitersPer100Km: 5, fuelPricePerLiter: 1.5, tolls: 10 });
  assert.equal(result.litersNeeded, 25);
  assert.equal(result.totalCost, 47.5);
});
