import { calculateRoi } from '../lib/calculations/roi';
import { formatEuro } from '../lib/formatters/currency';
const form=document.querySelector<HTMLFormElement>('#roi-form')!; const investment=form.elements.namedItem('investment') as HTMLInputElement; const resultValue=form.elements.namedItem('resultValue') as HTMLInputElement; const extraCosts=form.elements.namedItem('extraCosts') as HTMLInputElement;
const roi=document.querySelector<HTMLElement>('[data-result="roi"]')!; const gain=document.querySelector<HTMLElement>('[data-result="gain"]')!;
const calc=()=>{try{const r=calculateRoi({investment:investment.valueAsNumber,resultValue:resultValue.valueAsNumber,extraCosts:extraCosts.valueAsNumber});roi.textContent=`${r.roiPercent.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})} %`;gain.textContent=formatEuro(r.gain);}catch{roi.textContent='—';}}; form.addEventListener('submit',e=>{e.preventDefault();calc();});calc();
