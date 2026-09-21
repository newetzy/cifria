export type RepaymentMode = 'reduce-term' | 'reduce-payment';
export interface EarlyRepaymentInput { principal: number; annualRatePercent: number; remainingYears: number; extraPayment: number; mode: RepaymentMode; }
export interface EarlyRepaymentResult { oldPayment: number; newPayment: number; oldInterest: number; newInterest: number; interestSaved: number; monthsSaved: number; }

function payment(principal: number, annualRatePercent: number, months: number): number {
  const rate = annualRatePercent / 100 / 12;
  return rate === 0 ? principal / months : principal * rate / (1 - Math.pow(1 + rate, -months));
}

function repaymentSchedule(principal: number, annualRatePercent: number, monthlyPayment: number): { interest: number; months: number } {
  const rate = annualRatePercent / 100 / 12;
  let balance = principal;
  let interest = 0;
  let months = 0;
  while (balance > 0.000001 && months < 1200) {
    const monthlyInterest = balance * rate;
    const installment = Math.min(monthlyPayment, balance + monthlyInterest);
    interest += monthlyInterest;
    balance = Math.max(0, balance + monthlyInterest - installment);
    months += 1;
  }
  return { interest, months };
}

function wholeMonths(years: number): number {
  const months = Math.round(years * 12);
  if (months < 1) throw new Error('El plazo debe equivaler al menos a un mes.');
  return months;
}

export function calculateEarlyRepayment(input: EarlyRepaymentInput): EarlyRepaymentResult {
  if (!Number.isFinite(input.principal) || input.principal <= 0) throw new Error('El capital pendiente debe ser mayor que cero.');
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) throw new Error('El tipo no puede ser negativo.');
  if (!Number.isFinite(input.remainingYears) || input.remainingYears <= 0) throw new Error('El plazo restante debe ser mayor que cero.');
  if (!Number.isFinite(input.extraPayment) || input.extraPayment <= 0 || input.extraPayment >= input.principal) throw new Error('La amortizacion debe ser positiva y menor que el capital pendiente.');

  const months = wholeMonths(input.remainingYears);
  const oldPayment = payment(input.principal, input.annualRatePercent, months);
  const oldSchedule = repaymentSchedule(input.principal, input.annualRatePercent, oldPayment);
  const newPrincipal = input.principal - input.extraPayment;
  let newPayment = oldPayment;
  let newSchedule = oldSchedule;

  if (input.mode === 'reduce-payment') {
    newPayment = payment(newPrincipal, input.annualRatePercent, months);
    newSchedule = repaymentSchedule(newPrincipal, input.annualRatePercent, newPayment);
  } else {
    newSchedule = repaymentSchedule(newPrincipal, input.annualRatePercent, oldPayment);
  }

  return {
    oldPayment,
    newPayment,
    oldInterest: oldSchedule.interest,
    newInterest: newSchedule.interest,
    interestSaved: Math.max(0, oldSchedule.interest - newSchedule.interest),
    monthsSaved: Math.max(0, oldSchedule.months - newSchedule.months),
  };
}
