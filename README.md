# Cifria - Fases 18, 19 y 20

## Fase 18 - Contenido de intención
- Añadidas 6 guías evergreen orientadas a búsquedas concretas.
- Registradas en el catálogo central para aparecer en búsqueda/directorio.

## Fase 19 - Enlazado y descubrimiento
- `CalculatorShell` usa coincidencia de keywords para conectar calculadoras con guías, comparadores y escenarios relacionados.
- La home incorpora un bloque de siguiente paso para mejorar la navegación entre clusters.

## Fase 20 - Mantenimiento técnico
- El sitemap se genera antes de cada build a partir de las páginas `.astro` reales.
- Se excluyen la 404 y la búsqueda interna del sitemap.
- `npm run build` mantiene la generación automática del inventario de URLs.


## SEO

Para revisar metadatos, H1, títulos duplicados y enlaces internos: `npm run seo:audit`. El comando devuelve un informe JSON y termina con código distinto de 0 si encuentra errores de SEO estructural.
