export type TaxBracket = readonly [number, number];
export type AutonomousCommunity =
  | 'andalucia' | 'aragon' | 'asturias' | 'baleares' | 'canarias' | 'cantabria'
  | 'castilla-la-mancha' | 'castilla-y-leon' | 'cataluna' | 'extremadura'
  | 'galicia' | 'madrid' | 'murcia' | 'la-rioja' | 'valenciana' | 'ceuta-melilla';

const brackets = (...values: TaxBracket[]) => values;

/**
 * IRPF 2025 / campaña Renta 2026.
 * Fuente de las escalas: AEAT, Manual práctico Renta 2025, apartados
 * «Escalas y tipos de gravamen» estatal y autonómico.
 * Fuente de mínimos: AEAT, Manual práctico Renta 2025, «Mínimo personal y familiar».
 */
export const irpf2025 = {
  exercise: 2025,
  campaign: 2026,
  sources: {
    scales: 'https://sede.agenciatributaria.gob.es/Sede/Ayuda/25Manual/100.html',
    minimums: 'https://sede.agenciatributaria.gob.es/Sede/Ayuda/25Manual/101.html',
  },
  stateGeneral: brackets([12450, 0.095], [20200, 0.12], [35200, 0.15], [60000, 0.185], [300000, 0.225], [Infinity, 0.245]),
  autonomous: {
    andalucia: brackets([13000, 0.095], [21100, 0.12], [35200, 0.15], [60000, 0.185], [Infinity, 0.225]),
    aragon: brackets([13072.5, 0.095], [21210, 0.12], [36960, 0.15], [52500, 0.185], [60000, 0.205], [80000, 0.23], [90000, 0.24], [130000, 0.25], [Infinity, 0.255]),
    asturias: brackets([12450, 0.09], [17707.2, 0.12], [33007.2, 0.14], [53407.2, 0.192], [70000, 0.215], [90000, 0.225], [175000, 0.25], [Infinity, 0.26]),
    baleares: brackets([10000, 0.09], [18000, 0.1125], [30000, 0.1425], [48000, 0.175], [70000, 0.19], [90000, 0.2175], [120000, 0.2275], [175000, 0.2375], [Infinity, 0.2475]),
    canarias: brackets([13748, 0.09], [19422, 0.115], [35924, 0.14], [57566, 0.185], [93268, 0.235], [123745, 0.25], [Infinity, 0.26]),
    cantabria: brackets([13000, 0.085], [21000, 0.11], [35200, 0.145], [60000, 0.18], [90000, 0.225], [Infinity, 0.245]),
    'castilla-la-mancha': brackets([12450, 0.095], [20200, 0.12], [35200, 0.15], [60000, 0.185], [Infinity, 0.225]),
    'castilla-y-leon': brackets([12450, 0.09], [20200, 0.12], [35200, 0.14], [53407.2, 0.185], [Infinity, 0.215]),
    cataluna: brackets([12500, 0.095], [22000, 0.125], [33000, 0.16], [53000, 0.19], [90000, 0.215], [120000, 0.235], [175000, 0.245], [Infinity, 0.255]),
    extremadura: brackets([12450, 0.08], [20200, 0.1], [24200, 0.16], [35200, 0.175], [60000, 0.21], [80200, 0.235], [99200, 0.24], [120200, 0.245], [Infinity, 0.25]),
    galicia: brackets([12985.35, 0.09], [21068.6, 0.1165], [35200, 0.149], [60000, 0.184], [Infinity, 0.225]),
    madrid: brackets([13362.22, 0.085], [19004.63, 0.107], [35425.68, 0.128], [57320.4, 0.174], [Infinity, 0.205]),
    murcia: brackets([12450, 0.095], [20200, 0.112], [34000, 0.133], [60000, 0.179], [Infinity, 0.225]),
    'la-rioja': brackets([12450, 0.08], [20200, 0.106], [35200, 0.136], [40000, 0.178], [50000, 0.183], [60000, 0.19], [120000, 0.245], [Infinity, 0.27]),
    valenciana: brackets([12000, 0.09], [22000, 0.12], [32000, 0.15], [42000, 0.175], [52000, 0.2], [62000, 0.225], [72000, 0.25], [100000, 0.265], [150000, 0.275], [200000, 0.285], [Infinity, 0.295]),
    'ceuta-melilla': brackets([12450, 0.095], [20200, 0.12], [35200, 0.15], [60000, 0.185], [Infinity, 0.225]),
  },
  communities: {
    andalucia: 'Andalucía', aragon: 'Aragón', asturias: 'Asturias', baleares: 'Illes Balears', canarias: 'Canarias', cantabria: 'Cantabria',
    'castilla-la-mancha': 'Castilla-La Mancha', 'castilla-y-leon': 'Castilla y León', cataluna: 'Cataluña', extremadura: 'Extremadura',
    galicia: 'Galicia', madrid: 'Comunidad de Madrid', murcia: 'Región de Murcia', 'la-rioja': 'La Rioja', valenciana: 'Comunitat Valenciana', 'ceuta-melilla': 'Ceuta o Melilla',
  } as Record<AutonomousCommunity, string>,
  savingsCombined: brackets([6000, 0.19], [50000, 0.21], [200000, 0.23], [300000, 0.27], [Infinity, 0.3]),
  personalMinimum: { base: 5550, over65: 1150, over75: 1400, disability33: 3000, disability65: 9000 },
  scope: {
    individualPensionReduction: false,
    familyMinimums: false,
    autonomousMinimumVariations: false,
    autonomousDeductions: false,
    foralRegimes: false,
  },
} as const;
