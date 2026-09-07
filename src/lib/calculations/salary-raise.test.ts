import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryRaise } from './salary-raise.ts';
test('calcula una subida salarial', () => assert.deepEqual(calculateSalaryRaise({ currentSalary: 32000, raisePercent: 5 }), { increase: 1600, newSalary: 33600, monthlyIncrease: 133.33333333333334 }));
