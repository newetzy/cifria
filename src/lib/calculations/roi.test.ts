import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi } from './roi.ts';
test('calcula ROI', () => assert.deepEqual(calculateRoi({ investment: 10000, resultValue: 12000, extraCosts: 500 }), { gain: 1500, roiPercent: 15 }));
