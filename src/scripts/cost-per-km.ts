import '../styles/compound-interest.css';
import { calculateCostPerKm, type CostPerKmInput } from '../lib/calculations/cost-per-km';
import { formatEuro } from '../lib/formatters/currency';
const form = document.querySelector<HTMLFormElement>('#cost-per-km-form');
if (!form) throw new Error('No se encontro el formulario de coste por kilometro.');
const fields = { distanceKm: form.querySelector<HTMLInputElement>('#distanceKm')!, fuelLitresPer100Km: form.querySelector<HTMLInputElement>('#fuelLitresPer100Km')!, fuelPricePerLitre: form.querySelector<HTMLInputElement>('#fuelPricePerLitre')!, fixedCostPerYear: form.querySelector<HTMLInputElement>('#fixedCostPerYear')!, annualKm: form.querySelector<HTMLInputElement>('#annualKm')! };
const results = document.querySelector<HTMLElement>('#cost-per-km-results')!;
const announcement = document.querySelector<HTMLElement>('#cost-per-km-announcement')!;
const values = { costPerKm: document.querySelector<HTMLElement>('[data-result="costPerKm"]')!, fuelCostPerTrip: document.querySelector<HTMLElement>('[data-result="fuelCostPerTrip"]')!, totalTripCost: document.querySelector<HTMLElement>('[data-result="totalTripCost"]')! };
const calculate = () => {
  const input: CostPerKmInput = { distanceKm: fields.distanceKm.valueAsNumber, fuelLitresPer100Km: fields.fuelLitresPer100Km.valueAsNumber, fuelPricePerLitre: fields.fuelPricePerLitre.valueAsNumber, fixedCostPerYear: fields.fixedCostPerYear.valueAsNumber, annualKm: fields.annualKm.valueAsNumber };
  try { const result = calculateCostPerKm(input); values.costPerKm.textContent = `${formatEuro(result.costPerKm)} / km`; values.fuelCostPerTrip.textContent = formatEuro(result.fuelCostPerTrip); values.totalTripCost.textContent = formatEuro(result.totalTripCost); results.hidden = false; announcement.textContent = `Coste estimado por kilometro: ${formatEuro(result.costPerKm)}.`; }
  catch (error) { announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.'; }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
