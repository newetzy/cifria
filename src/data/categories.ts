export type Category = {
  slug: 'vivienda' | 'nomina' | 'impuestos' | 'prestamos' | 'ahorro-inversion' | 'coche';
  name: string;
  description: string;
  accent: string;
};

export const categories: Category[] = [
  { slug: 'vivienda', name: 'Vivienda', description: 'Herramientas para tomar decisiones sobre compra, alquiler e hipoteca.', accent: '01' },
  { slug: 'nomina', name: 'Nómina', description: 'Calculadoras para entender tu salario, pagas y retenciones.', accent: '02' },
  { slug: 'impuestos', name: 'Impuestos', description: 'Herramientas para orientarte en cálculos tributarios habituales.', accent: '03' },
  { slug: 'prestamos', name: 'Préstamos', description: 'Simula cuotas, intereses y el coste de financiar una compra.', accent: '04' },
  { slug: 'ahorro-inversion', name: 'Ahorro e inversión', description: 'Visualiza cómo crecen el ahorro y las aportaciones en el tiempo.', accent: '05' },
  { slug: 'coche', name: 'Coche', description: 'Calcula cuánto te cuesta realmente desplazarte y hacer un viaje en coche.', accent: '06' },
];

export const navigation = categories.map(({ slug, name }) => ({ href: `/${slug}/`, name }));
