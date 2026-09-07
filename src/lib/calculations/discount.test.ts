import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscount } from './discount.ts';
test('calcula un descuento', () => assert.deepEqual(calculateDiscount({ price: 100, discountPercent: 20 }), { discountAmount: 20, finalPrice: 80 }));
test('rechaza descuentos mayores que 100', () => assert.throws(() => calculateDiscount({ price: 100, discountPercent: 101 })));
