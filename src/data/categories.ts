export type Category = {
  slug: 'vivienda' | 'nomina' | 'impuestos' | 'prestamos' | 'ahorro-inversion' | 'coche';
  name: string;
  description: string;
  accent: string;
  tools: string[];
};

export const categories: Category[] = [
  { slug: 'vivienda', name: 'Vivienda', description: 'Herramientas para tomar decisiones sobre compra, alquiler e hipoteca.', accent: '01', tools: ['Calculadora de hipoteca', 'Rentabilidad del alquiler', 'Gastos de compra de vivienda', 'Comprar vs. alquilar'] },
  { slug: 'nomina', name: 'Nómina', description: 'Calculadoras para entender tu salario, pagas y retenciones.', accent: '02', tools: ['Salario por hora', 'Sueldo neto', 'Bruto a neto', '12 vs. 14 pagas'] },
  { slug: 'impuestos', name: 'Impuestos', description: 'Herramientas para orientarte en cálculos tributarios habituales.', accent: '03', tools: ['Calculadora de IVA', 'Añadir o quitar IVA', 'IRPF', 'ITP'] },
  { slug: 'prestamos', name: 'Préstamos', description: 'Simula cuotas, intereses y el coste de financiar una compra.', accent: '04', tools: ['Cuota de préstamo', 'Amortización anticipada', 'Amortización', 'TIN y TAE', 'Coste total del préstamo'] },
  { slug: 'ahorro-inversion', name: 'Ahorro e inversión', description: 'Visualiza cómo crecen el ahorro y las aportaciones en el tiempo.', accent: '05', tools: ['Interés compuesto', 'Objetivo de ahorro', 'Inflación', 'Aportaciones periódicas', 'Interés simple', 'ROI'] },
  { slug: 'coche', name: 'Coche', description: 'Calcula cuánto te cuesta realmente desplazarte y hacer un viaje en coche.', accent: '06', tools: ['Coste de viaje', 'Coste por kilómetro', 'Combustible por viaje', 'Financiación de coche'] },
];

export const navigation = categories.map(({ slug, name }) => ({ href: `/${slug}/`, name }));
