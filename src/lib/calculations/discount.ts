export interface DiscountInput { price: number; discountPercent: number; }
export interface DiscountResult { discountAmount: number; finalPrice: number; }
export function calculateDiscount(input: DiscountInput): DiscountResult {
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error('El precio debe ser igual o mayor que 0.');
  if (!Number.isFinite(input.discountPercent) || input.discountPercent < 0 || input.discountPercent > 100) throw new Error('El descuento debe estar entre 0 % y 100 %.');
  const discountAmount = input.price * input.discountPercent / 100;
  return { discountAmount, finalPrice: input.price - discountAmount };
}
