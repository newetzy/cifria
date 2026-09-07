import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTip } from './tip.ts';
test('calcula propina y reparto', () => assert.deepEqual(calculateTip({ amount: 80, tipPercent: 10, people: 4 }), { tipAmount: 8, total: 88, perPerson: 22 }));
