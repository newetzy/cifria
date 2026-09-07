export type FuelTripInput = {
  distanceKm: number;
  consumptionLitersPer100Km: number;
  fuelPricePerLiter: number;
  tolls: number;
};

export type FuelTripResult = FuelTripInput & {
  litersNeeded: number;
  fuelCost: number;
  totalCost: number;
  costPerKm: number;
};

export function calculateFuelTrip(input: FuelTripInput): FuelTripResult {
  if (!Number.isFinite(input.distanceKm) || input.distanceKm <= 0) throw new RangeError('La distancia debe ser mayor que 0.');
  if (!Number.isFinite(input.consumptionLitersPer100Km) || input.consumptionLitersPer100Km <= 0 || input.consumptionLitersPer100Km > 50) throw new RangeError('El consumo debe estar entre 0 y 50 L/100 km.');
  if (!Number.isFinite(input.fuelPricePerLiter) || input.fuelPricePerLiter <= 0 || input.fuelPricePerLiter > 10) throw new RangeError('El precio del combustible debe estar entre 0 y 10 €/litro.');
  if (!Number.isFinite(input.tolls) || input.tolls < 0) throw new RangeError('Los peajes no pueden ser negativos.');

  const litersNeeded = input.distanceKm * input.consumptionLitersPer100Km / 100;
  const fuelCost = litersNeeded * input.fuelPricePerLiter;
  const totalCost = fuelCost + input.tolls;

  return { ...input, litersNeeded, fuelCost, totalCost, costPerKm: totalCost / input.distanceKm };
}
