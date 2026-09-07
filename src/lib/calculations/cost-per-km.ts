export interface CostPerKmInput { distanceKm: number; fuelLitresPer100Km: number; fuelPricePerLitre: number; fixedCostPerYear: number; annualKm: number; }
export interface CostPerKmResult { fuelCostPerTrip: number; totalTripCost: number; costPerKm: number; }
export function calculateCostPerKm(input: CostPerKmInput): CostPerKmResult {
  if (!Number.isFinite(input.distanceKm) || input.distanceKm <= 0) throw new Error('La distancia debe ser mayor que cero.');
  if (!Number.isFinite(input.fuelLitresPer100Km) || input.fuelLitresPer100Km <= 0) throw new Error('El consumo debe ser mayor que cero.');
  if (!Number.isFinite(input.fuelPricePerLitre) || input.fuelPricePerLitre < 0) throw new Error('El precio del combustible no puede ser negativo.');
  if (!Number.isFinite(input.fixedCostPerYear) || input.fixedCostPerYear < 0) throw new Error('Los costes fijos no pueden ser negativos.');
  if (!Number.isFinite(input.annualKm) || input.annualKm <= 0) throw new Error('Los kilometros anuales deben ser mayores que cero.');
  const fuelCostPerTrip = input.distanceKm / 100 * input.fuelLitresPer100Km * input.fuelPricePerLitre;
  const costPerKm = fuelCostPerTrip / input.distanceKm + input.fixedCostPerYear / input.annualKm;
  return { fuelCostPerTrip, totalTripCost: costPerKm * input.distanceKm, costPerKm };
}
