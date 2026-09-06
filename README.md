# Cifria

Portal estático de calculadoras financieras para particulares en España.

## Desarrollo

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run check`: valida Astro y TypeScript.
- `npm run build`: genera el sitio estático en `dist/`.

## Estructura

- `src/components/`: piezas reutilizables de interfaz y calculadoras.
- `src/layouts/`: estructura común y metadatos SEO.
- `src/pages/`: portada, categorías, páginas legales y rutas técnicas.
- `src/lib/`: lógica de cálculos, formato y validación; separada de la interfaz.
- `src/data/`: futuros datos normativos estructurados y actualizables.

La primera calculadora se implementará en una fase posterior. Los cálculos normativos se incorporarán únicamente tras contrastar fuentes oficiales.
