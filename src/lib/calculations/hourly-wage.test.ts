import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateHourlyWage } from './hourly-wage.ts';

test('calcula el bruto por hora', () => {
  const result = calculateHourlyWage({ annualGrossSalary: 31200, weeklyHours: 40, vacationWeeks: 4, extraAnnualHours: 0 });
  assert.equal(result.annualHours, 1920);
  assert.equal(result.hourlyGross, 16.25);
});
