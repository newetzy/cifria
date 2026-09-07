import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRentYield } from './rent-yield.ts';
test('calcula rentabilidad bruta y neta', () => { const r = calculateRentYield({ purchasePrice: 200000, monthlyRent: 1000, annualExpenses: 1200 }); assert.equal(r.annualRent, 12000); assert.equal(r.grossYield, 6); assert.equal(r.netAnnualIncome, 10800); assert.equal(r.netYield, 5.4); });
