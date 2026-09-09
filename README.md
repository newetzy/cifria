# Cifria

Cifria es una web estática de calculadoras financieras en español. Ayuda a entender préstamos, hipotecas, ahorro, inversión, impuestos, nómina y costes de vehículo mediante cálculos transparentes ejecutados en el navegador.

## Requisitos

- Node.js 22.12 o superior
- npm

## Desarrollo

```powershell
npm install
npm run dev
```

La aplicación se sirve en la dirección que muestra Astro, normalmente `http://localhost:4321`.

## Comandos de calidad

```powershell
npm run check      # Diagnósticos de Astro y TypeScript
npm run test       # Cálculos y generación del sitemap
npm run seo:audit  # Metadatos, H1 y enlaces internos
npm run seo:report # Objetivos SEO prioritarios
npm run build      # Genera el sitio estático en dist/
```

Antes de publicar, ejecuta `npm run check`, `npm run test`, `npm run seo:audit` y `npm run build`.

## Estructura

```text
src/
  components/        Componentes Astro reutilizables
  data/              Catálogo de herramientas, datos legales y rutas generadas
  layouts/           Estructura global de las páginas
  lib/calculations/  Fórmulas financieras y sus pruebas
  pages/             Rutas estáticas del sitio
  scripts/           Interactividad de las calculadoras en el navegador
  styles/            Estilos globales y específicos
scripts/             Automatizaciones de SEO y sitemap
public/              Recursos estáticos
```

Las fórmulas viven en `src/lib/calculations/`, separadas de la interfaz y cubiertas por pruebas. Las calculadoras consumen esas fórmulas desde scripts de navegador.

## SEO y sitemap

El catálogo de páginas se obtiene de las rutas `.astro` reales antes de cada build. El sitemap incluye la portada como `/` y excluye la página 404 y la búsqueda interna (`/buscar/`).

`npm run seo:audit` comprueba metadatos, títulos y descripciones duplicados, H1 y enlaces internos. `npm run seo:report` valida los objetivos SEO definidos en `scripts/seo-targets.mjs`.

## Privacidad, analítica y publicidad

Las calculadoras funcionan en el navegador sin crear cuentas ni enviar los importes introducidos a Cifria.

Google Tag Manager se carga en el `<head>` con Consent Mode inicial configurado para denegar analítica. La analítica se habilita solo cuando la persona acepta; el sitio conserva la preferencia en `localStorage` y emite el evento `cifria_consent_granted`. En GTM, la etiqueta de GA4 debe activarse mediante ese evento y respetar el consentimiento.

La publicidad es opcional y se configura mediante estas variables públicas:

```text
PUBLIC_ADSENSE_CLIENT=
PUBLIC_ADSENSE_TOP_SLOT=
PUBLIC_ADSENSE_BOTTOM_SLOT=
```

Usa `.env.example` como referencia. Completa `src/data/legal.ts` con los datos legales definitivos antes de publicar o monetizar el sitio.
