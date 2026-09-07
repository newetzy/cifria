export type RepaymentMode = 'reduce-term' | 'reduce-payment';
export interface EarlyRepaymentInput { principal: number; annualRatePercent: number; remainingYears: number; extraPayment: number; mode: RepaymentMode; }
export interface EarlyRepaymentResult { oldPayment: number; newPayment: number; oldInterest: number; newInterest: number; interestSaved: number; monthsSaved: number; }

function payment(principal: number, annualRatePercent: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  return r === 0 ? principal / months : principal * r / (1 - Math.pow(1 + r, -months));
}
function remainingAfterMonths(principal: number, annualRatePercent: number, monthlyPayment: number, months: number): number {
  let balance = principal;
  const r = annualRatePercent / 100 / 12;
  for (let i = 0; i < months && balance > 0.000001; i += 1) {
    const interest = balance * r;
    balance = Math.max(0, balance + interest - monthlyPayment);
  }
  return balance;
}
export function calculateEarlyRepayment(input: EarlyRepaymentInput): EarlyRepaymentResult {
  if (!Number.isFinite(input.principal) || input.principal <= 0) throw new Error('El capital pendiente debe ser mayor que cero.');
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) throw new Error('El tipo no puede ser negativo.');
  if (!Number.isFinite(input.remainingYears) || input.remainingYears <= 0) throw new Error('El plazo restante debe ser mayor que cero.');
  if (!Number.isFinite(input.extraPayment) || input.extraPayment <= 0 || input.extraPayment >= input.principal) throw new Error('La amortizacion debe ser positiva y menor que el capital pendiente.');
  const months = Math.round(input.remainingYears * 12);
  const oldPayment = payment(input.principal, input.annualRatePercent, months);
  const oldInterest = oldPayment * months - input.principal;
  let newPayment = oldPayment;
  let newMonths = months;
  if (input.mode === 'reduce-payment') {
    newPayment = payment(input.principal - input.extraPayment, input.annualRatePercent, months);
    newMonths = months;
  } else {
    const newPrincipal = input.principal - input.extraPayment;
    if (input.annualRatePercent === 0) newMonths = Math.ceil(newPrincipal / oldPayment);
    else {
      let balance = newPrincipal;
      const r = input.annualRatePercent / 100 / 12;
      newMonths = 0;
      while (balance > 0.000001 && newMonths < 1200) {
        balance = Math.max(0, balance + balance * r - oldPayment);
        newMonths += 1;
      }
    }
  }
  const newPrincipal = input.principal - input.extraPayment;
  const newInterest = input.mode === 'reduce-payment' ? newPayment * months - newPrincipal : oldPayment * newMonths - newPrincipal;
  return { oldPayment, newPayment, oldInterest, newInterest, interestSaved: Math.max(0, oldInterest - newInterest), monthsSaved: Math.max(0, months - newMonths) };
}
