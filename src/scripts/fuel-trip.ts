import { calculateFuelTrip, type FuelTripInput } from '../lib/calculations/fuel-trip';
import { formatEuro, formatNumber } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#fuel-trip-form');
if (!form) throw new Error('No se encontró el formulario de coste de viaje.');
const fields = {
  distanceKm: form.elements.namedItem('distanceKm') as HTMLInputElement,
  consumptionLitersPer100Km: form.elements.namedItem('consumptionLitersPer100Km') as HTMLInputElement,
  fuelPricePerLiter: form.elements.namedItem('fuelPricePerLiter') as HTMLInputElement,
  tolls: form.elements.namedItem('tolls') as HTMLInputElement,
};
const results = document.querySelector<HTMLElement>('#fuel-trip-results')!;
const announcement = document.querySelector<HTMLElement>('#fuel-trip-announcement')!;
const values = {
  litersNeeded: document.querySelector<HTMLElement>('[data-result="litersNeeded"]')!,
  fuelCost: document.querySelector<HTMLElement>('[data-result="fuelCost"]')!,
  tolls: document.querySelector<HTMLElement>('[data-result="tolls"]')!,
  totalCost: document.querySelector<HTMLElement>('[data-result="totalCost"]')!,
  costPerKm: document.querySelector<HTMLElement>('[data-result="costPerKm"]')!,
};
const calculate = (): void => {
  const input: FuelTripInput = { distanceKm: fields.distanceKm.valueAsNumber, consumptionLitersPer100Km: fields.consumptionLitersPer100Km.valueAsNumber, fuelPricePerLiter: fields.fuelPricePerLiter.valueAsNumber, tolls: fields.tolls.valueAsNumber };
  try {
    const result = calculateFuelTrip(input);
    values.litersNeeded.textContent = `${formatNumber(result.litersNeeded)} L`;
    values.fuelCost.textContent = formatEuro(result.fuelCost);
    values.tolls.textContent = formatEuro(result.tolls);
    values.totalCost.textContent = formatEuro(result.totalCost);
    values.costPerKm.textContent = `${result.costPerKm.toFixed(2).replace('.', ',')} €/km`;
    results.hidden = false;
    announcement.textContent = `El coste total estimado del viaje es ${formatEuro(result.totalCost)}.`;
  } catch (error) {
    announcement.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.';
  }
};
form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
calculate();
