export const formatEuro = (value: number): string => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value);

export const formatNumber = (value: number): string => new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 2,
}).format(value);
