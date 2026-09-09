# Revisión SEO y código — 9 de septiembre de 2026

## Alcance y conclusión

Auditoría del código y del HTML generado localmente en dist. No certifica el despliegue de producción, las respuestas HTTP, Search Console, rendimiento real ni todos los comportamientos interactivos. No se han modificado funcionalidades ni contenidos del sitio en esta revisión. Se conservan los cambios de interfaz previos.

El sitemap local es coherente, pero el trabajo editorial NO está completo según los requisitos solicitados. Las afirmaciones anteriores de finalización fueron demasiado amplias.

## Comprobaciones satisfactorias

- 103 archivos HTML: 101 páginas indexables y dos excluidas (búsqueda y 404).
- Sitemap con 101 URLs, sin duplicados, omisiones ni destinos inexistentes respecto al HTML indexable.
- Propina no aparece en el sitemap.
- robots.txt apunta a sitemap-index.xml y este a sitemap.xml, usando https://cifria.es.
- Canonical coherente en las páginas indexables; un H1 por página indexable.
- Sin títulos ni descripciones duplicados en el HTML indexable.
- Sin destinos internos inexistentes entre los enlaces locales comprobados. No se validaron anclas, enlaces externos ni estados HTTP.
- Sin errores de sintaxis JSON en los bloques JSON-LD. Esto no certifica su elegibilidad para resultados enriqueccidos.
- Sin caracteres de sustitución detectados en el HTML auditado.
- npm.cmd run check: 0 errores, 0 warnings y 29 hints.
- npm.cmd test: 44 pruebas correctas.
- npm.cmd run seo:audit: pasa, pero tiene las carencias indicadas más abajo.

## Hallazgos por prioridad

### Alta: el selector autonómico del IRPF no interviene en el cálculo

En src/lib/calculations/irpf.ts, calculateIrpf no consulta input.region y aplica una única escala. En src/pages/impuestos/calculadora-irpf.astro se solicita la comunidad y el texto invita a elegir residencia fiscal por su influencia en el impuesto. Cambiar únicamente la comunidad produce el mismo resultado.

Recomendación: antes de ampliar su promoción, implementar y verificar las diferencias fiscales con fuentes oficiales y pruebas, o retirar ese selector y explicar con precisión el alcance del modelo simplificado. Esta revisión identifica la incoherencia de software, no valida los tipos fiscales vigentes.

El motor tampoco valida dependantsOver65 como entero no negativo, aunque lo utiliza para calcular el mínimo personal. Añadir validación y pruebas de entradas inválidas.

### Alta: cumplimiento editorial incompleto

- 95 de las 101 páginas indexables tienen una descripción fuera del intervalo solicitado de 145–155 caracteres.
- 4 títulos superan los 60 caracteres.
- 59 páginas tienen menos de 300 palabras incluso contando todo el contenido de main.
- En 17 de las 18 calculadoras, las secciones .content-section.prose suman menos de 300 palabras.
- Las 18 calculadoras contienen tres elementos de FAQ, pero esto por sí solo no demuestra cumplimiento de keyword, extensión ni integración editorial discreta.
- Hay inconsistencias entre la frase del H1 y la descripción, especialmente en las calculadoras optimizadas primero. Falta verificar una keyword principal explícita por URL, su presencia en la primera frase, sus 3–6 apariciones naturales y el CTA final.
- No se ha completado el mapa final URL | keyword solicitado.

Estas cifras contrastan con tus requisitos editoriales; no representan umbrales universales de posicionamiento. No conviene rellenar con texto repetitivo para alcanzar cifras.

Los cuatro títulos largos son:
- /blog/euribor-septiembre-2026/: 81 caracteres.
- /blog/hipoteca-vs-alquiler-2026/: 82 caracteres.
- /blog/novedades-irpf-renta-2026/: 77 caracteres.
- /nomina/salario-por-hora-40-horas/: 64 caracteres.

### Media: página de metodología contradictoria

src/pages/fuentes-metodologia.astro afirma que todavía no hay cálculos fiscales, laborales o normativos y que no se muestran tipos ni tramos. Esto contradice las calculadoras publicadas de IRPF e IVA. Actualizar estado, alcance, metodología, fuentes y fechas reales de revisión.

### Media: navegación y catálogo inconsistentes

- src/components/CategoryPage.astro no incluye IRPF en el mapa de enlaces de impuestos. El filtrado elimina esa herramienta del listado de su categoría.
- El mismo mapa ofrece dos entradas hacia la calculadora de IVA.
- src/data/tools.ts contempla el tipo comparador, pero no registra los ocho comparadores existentes. El buscador y el directorio no reflejan adecuadamente esa parte del sitio.
- Recomendación: reducir duplicación de rutas y generar los listados desde un catálogo común, con pruebas de cobertura.

### Media: la auditoría automatizada da una visión incompleta

scripts/seo-audit.mjs inspecciona archivos Astro y omite rutas dinámicas. Informa de 97 páginas frente a las 101 indexables generadas. No comprueba las reglas de longitudes, extensión editorial, keyword ni FAQs solicitadas.

Recomendación: auditar dist tras el build y contrastarlo con un mapa explícito URL/keyword; comprobar sitemap, canonical, metadatos, H1, enlaces y requisitos editoriales. Mantener revisión humana para utilidad, naturalidad y exactitud.

### Media: blog y contenido de apoyo pendientes

Los hubs de categorías y varios escenarios, comparadores y artículos de glosario son breves. Los ocho comparadores tienen entre 190 y 228 palabras en main. Las categorías del blog contienen muy poco texto.

El título del artículo sobre Euríbor menciona una cifra próxima al 3 %, sin una fuente fechada que la justifique en el artículo. No se ha comprobado aquí si la cifra es correcta: debe verificarse y citarse o eliminarse del título.

BlogPostLayout.astro no añade un marcado específico BlogPosting con autor y fechas del artículo; el marcado general WebPage no aprovecha esos datos. Es una mejora potencial, no un error de sintaxis ni una garantía de resultados enriqueccidos.

### Baja: mantenimiento del generador del sitemap

El generador cubre correctamente las rutas actuales, pero combina archivos Astro estáticos con reglas particulares para Markdown y categorías del blog. Nuevas rutas dinámicas o páginas noindex requerirían actualizar esas reglas. Conviene añadir una prueba que contraste automáticamente el sitemap con el HTML final.

## Inventario por calculadora

Longitudes del HTML generado. Palabras editoriales: texto de las secciones .content-section.prose, incluyendo encabezados y FAQs que estén dentro. No se cuentan formularios o enlaces relacionados como explicación útil. Los conteos son aproximados por separación de espacios.

| URL | Title: caracteres | Description: caracteres | Palabras editoriales | FAQs |
| --- | ---: | ---: | ---: | ---: |
| /ahorro-inversion/aportaciones-periodicas/ | 40 | 140 | 189 | 3 |
| /ahorro-inversion/calculadora-inflacion/ | 47 | 123 | 117 | 3 |
| /ahorro-inversion/interes-compuesto/ | 43 | 123 | 178 | 3 |
| /ahorro-inversion/interes-simple/ | 38 | 113 | 94 | 3 |
| /ahorro-inversion/objetivo-ahorro/ | 44 | 145 | 193 | 3 |
| /ahorro-inversion/roi/ | 38 | 137 | 232 | 3 |
| /calculadoras/descuento/ | 42 | 145 | 227 | 3 |
| /calculadoras/porcentaje/ | 43 | 136 | 207 | 3 |
| /calculadoras/subida-salarial/ | 37 | 142 | 238 | 3 |
| /coche/coste-por-kilometro/ | 47 | 148 | 235 | 3 |
| /coche/coste-viaje/ | 41 | 150 | 238 | 3 |
| /impuestos/calculadora-irpf/ | 33 | 147 | 338 | 3 |
| /impuestos/calculadora-iva/ | 40 | 136 | 242 | 3 |
| /nomina/salario-por-hora/ | 40 | 139 | 202 | 3 |
| /prestamos/amortizacion-anticipada/ | 41 | 144 | 222 | 3 |
| /prestamos/calculadora-cuota-prestamo/ | 40 | 136 | 232 | 3 |
| /vivienda/calculadora-hipoteca/ | 43 | 122 | 263 | 3 |
| /vivienda/rentabilidad-alquiler/ | 42 | 126 | 140 | 3 |

## Resto de páginas indexables

Palabras en main incluye tarjetas y otros elementos: alcanzar 300 aquí no demuestra tener 300 palabras editoriales útiles. Las páginas legales se incluyen en el inventario porque se pidió revisar todo el sitio; no se recomienda forzar keywords o CTAs comerciales en sus textos.

| URL | Title: caracteres | Description: caracteres | Palabras en main |
| --- | ---: | ---: | ---: |
| /ahorro-inversion/200-euros-5-porciento-10-anos/ | 48 | 94 | 310 |
| /ahorro-inversion/ahorrar-200-euros-mes/ | 33 | 116 | 303 |
| /ahorro-inversion/ahorrar-300-euros-mes/ | 44 | 80 | 320 |
| /ahorro-inversion/ahorrar-500-euros-mes/ | 44 | 111 | 338 |
| /ahorro-inversion/escenarios/ahorrar-100-euros-mes/ | 33 | 85 | 171 |
| /ahorro-inversion/escenarios/ahorrar-10000-euros/ | 34 | 88 | 193 |
| /ahorro-inversion/ | 43 | 110 | 122 |
| /aviso-legal/ | 20 | 77 | 518 |
| /blog/categoria/fiscalidad/ | 24 | 45 | 40 |
| /blog/categoria/ | 28 | 79 | 14 |
| /blog/categoria/vivienda/ | 22 | 43 | 77 |
| /blog/euribor-septiembre-2026/ | 81 | 87 | 243 |
| /blog/hipoteca-vs-alquiler-2026/ | 82 | 83 | 281 |
| /blog/ | 47 | 96 | 137 |
| /blog/novedades-irpf-renta-2026/ | 77 | 111 | 248 |
| /calculadoras/ | 35 | 96 | 86 |
| /coche/coste-viaje-500-km/ | 48 | 125 | 301 |
| /coche/coste-viaje-gasolina/ | 50 | 94 | 344 |
| /coche/ | 44 | 99 | 87 |
| /comparadores/ahorrar-300-vs-500-euros/ | 48 | 94 | 208 |
| /comparadores/ahorrar-vs-invertir/ | 49 | 116 | 223 |
| /comparadores/amortizar-cuota-vs-plazo/ | 58 | 110 | 190 |
| /comparadores/hipoteca-20-vs-30-anos/ | 44 | 91 | 228 |
| /comparadores/ | 45 | 94 | 252 |
| /comparadores/interes-simple-vs-compuesto/ | 48 | 114 | 200 |
| /comparadores/iva-anadido-vs-incluido/ | 55 | 91 | 219 |
| /comparadores/prestamo-5-vs-7-anos/ | 52 | 85 | 212 |
| /comparadores/salario-35-vs-40-horas/ | 53 | 84 | 210 |
| /cookies/ | 28 | 71 | 315 |
| /escenarios/ | 43 | 114 | 219 |
| /fuentes-metodologia/ | 30 | 66 | 77 |
| /glosario/amortizacion/ | 43 | 100 | 130 |
| /glosario/cuota-mensual/ | 44 | 101 | 152 |
| /glosario/euribor/ | 38 | 95 | 149 |
| /glosario/ | 28 | 112 | 227 |
| /glosario/inflacion/ | 40 | 97 | 136 |
| /glosario/interes-compuesto/ | 48 | 105 | 114 |
| /glosario/irpf/ | 35 | 92 | 157 |
| /glosario/itp/ | 34 | 91 | 123 |
| /glosario/iva/ | 34 | 91 | 137 |
| /glosario/rentabilidad/ | 43 | 100 | 124 |
| /glosario/roi/ | 34 | 91 | 150 |
| /glosario/tae/ | 34 | 91 | 136 |
| /glosario/tin/ | 34 | 91 | 159 |
| /guias/amortizar-hipoteca/ | 50 | 116 | 291 |
| /guias/calcular-cuota-hipoteca/ | 47 | 130 | 360 |
| /guias/calcular-descuento/ | 53 | 91 | 261 |
| /guias/calcular-porcentaje/ | 47 | 124 | 292 |
| /guias/como-ahorrar-10000-euros/ | 46 | 119 | 312 |
| /guias/coste-por-kilometro/ | 57 | 95 | 327 |
| /guias/coste-real-coche/ | 48 | 103 | 296 |
| /guias/ | 37 | 112 | 143 |
| /guias/inflacion-y-poder-adquisitivo/ | 55 | 144 | 326 |
| /guias/interes-compuesto/ | 43 | 125 | 309 |
| /guias/salario-por-hora/ | 42 | 114 | 296 |
| /guias/tae-vs-tin/ | 56 | 134 | 380 |
| /herramientas/ | 43 | 94 | 1450 |
| /impuestos/calculadora-iva-21-por-ciento/ | 36 | 95 | 380 |
| /impuestos/escenarios/iva-10-por-ciento/ | 36 | 65 | 203 |
| /impuestos/escenarios/iva-4-por-ciento/ | 35 | 73 | 195 |
| /impuestos/ | 34 | 96 | 64 |
| / | 53 | 153 | 785 |
| /nomina/escenarios/salario-35-horas/ | 48 | 82 | 201 |
| /nomina/ | 41 | 105 | 80 |
| /nomina/salario-30000-40-horas/ | 55 | 116 | 334 |
| /nomina/salario-por-hora-40-horas/ | 64 | 120 | 346 |
| /politica-editorial/ | 27 | 98 | 180 |
| /prestamos/cuota-prestamo-5000-euros/ | 44 | 86 | 320 |
| /prestamos/escenarios/prestamo-10000-5-anos/ | 38 | 89 | 186 |
| /prestamos/escenarios/prestamo-20000-5-anos/ | 38 | 82 | 192 |
| /prestamos/ | 34 | 83 | 94 |
| /prestamos/prestamo-15000-5-anos/ | 42 | 112 | 294 |
| /prestamos/prestamo-20000-7-anos/ | 42 | 114 | 272 |
| /privacidad/ | 31 | 92 | 565 |
| /quienes-somos/ | 22 | 104 | 141 |
| /vivienda/cuota-hipoteca-20-anos/ | 42 | 114 | 388 |
| /vivienda/cuota-hipoteca-30-anos/ | 42 | 111 | 359 |
| /vivienda/escenarios/hipoteca-100000-30-anos/ | 40 | 107 | 243 |
| /vivienda/escenarios/hipoteca-150000-30-anos/ | 40 | 101 | 206 |
| /vivienda/escenarios/hipoteca-200000-30-anos/ | 40 | 88 | 211 |
| /vivienda/hipoteca-250000-30-anos/ | 44 | 134 | 358 |
| /vivienda/hipoteca-300000-30-anos/ | 44 | 114 | 319 |
| /vivienda/ | 44 | 103 | 115 |

## Orden recomendado para la siguiente intervención

1. Corregir la incoherencia funcional del IRPF y sus pruebas.
2. Actualizar metodología y reparar la cobertura del catálogo.
3. Completar las 18 calculadoras contra las reglas editoriales, sin considerar terminado el lote por tener FAQs.
4. Revisar hubs, guías, escenarios, comparadores y blog con fuentes cuando proceda.
5. Automatizar las comprobaciones sobre dist y cerrar el mapa URL | keyword.
6. Verificar despliegue y comportamiento visual antes de dar por cerrado el SEO.

No se ha hecho commit ni push en esta revisión.

