import { calculatePercentage } from '../lib/calculations/percentage';
import { formatEuro } from '../lib/formatters/currency';
const form=document.querySelector<HTMLFormElement>('#percentage-form')!;
const percentage=form.elements.namedItem('percentage') as HTMLInputElement; const value=form.elements.namedItem('value') as HTMLInputElement;
const amount=document.querySelector<HTMLElement>('[data-result="amount"]')!; const original=document.querySelector<HTMLElement>('[data-result="value"]')!; const total=document.querySelector<HTMLElement>('[data-result="total"]')!;
const calc=()=>{try{const r=calculatePercentage({percentage:percentage.valueAsNumber,value:value.valueAsNumber}); amount.textContent=formatEuro(r.amount); original.textContent=formatEuro(value.valueAsNumber); total.textContent=formatEuro(r.total);}catch{amount.textContent='—';}}; form.addEventListener('submit',e=>{e.preventDefault();calc();});calc();