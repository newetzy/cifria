# Cifria — Fases 23 + 24

## Fase 23: SEO de intención
- Registro central de objetivos SEO en `scripts/seo-targets.mjs`.
- Nuevo comando `npm run seo:report` para comprobar que las URLs prioritarias existen y detectar títulos duplicados.
- Clusters iniciales: hipotecas, préstamos, ahorro, salario y coche.
- La home destaca escenarios de búsqueda concretos para darles enlaces internos desde una URL con máxima relevancia.

## Fase 24: páginas de intención con ejemplos calculados
Nuevas páginas con ejemplos reproducibles y enlace directo a la calculadora:
- Hipoteca de 250.000 € a 30 años.
- Hipoteca de 300.000 € a 30 años.
- Préstamo de 15.000 € a 5 años.
- Préstamo de 20.000 € a 7 años.
- Ahorrar 200 € al mes.
- 200 € al mes al 5 % durante 10 años.
- Salario de 30.000 € con 40 horas semanales.
- Coste de un viaje de 500 km en gasolina.

Los valores numéricos de estas páginas son ejemplos matemáticos con hipótesis visibles. No se presentan como ofertas de mercado ni como previsiones.

## Comprobaciones
- `npm test` → 40/40.
- `npm run seo:audit` → sin metadatos faltantes, títulos/descripciones duplicados, H1 problemáticos o enlaces internos rotos; `/buscar/` permanece `noindex` de forma intencionada.
- `npm run seo:report` → 8/8 objetivos SEO presentes y sin títulos duplicados.
- El `astro build` debe comprobarse en el entorno Windows del proyecto antes de desplegar.
