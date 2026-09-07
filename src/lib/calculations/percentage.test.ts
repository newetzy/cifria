import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePercentage } from './percentage.ts';
test('calcula un porcentaje', () => assert.deepEqual(calculatePercentage({ percentage: 15, value: 200 }), { amount: 30, total: 230 }));
test('rechaza porcentajes negativos', () => assert.throws(() => calculatePercentage({ percentage: -1, value: 100 })));
