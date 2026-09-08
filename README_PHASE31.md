# Fase 31 — GTM + consentimiento corregido

Se corrige la integración de Google Tag Manager y GA4 para que:

- GTM esté presente desde el `<head>` y Tag Assistant pueda detectar/conectar el contenedor.
- Consent Mode se inicialice antes de GTM con `analytics_storage: denied`.
- GA4 no se dispare hasta que exista consentimiento.
- Al aceptar, Cifria actualice `analytics_storage: granted` y emita el evento `cifria_consent_granted`.
- El consentimiento previamente guardado se restaure en la carga inicial.
- Se mantiene la estética y el resto de las fases anteriores.

## Configuración requerida en Google Tag Manager

La etiqueta `Google tag - Cifria` debe utilizar el activador de evento personalizado:

`cifria_consent_granted`

No usar `Initialization - All Pages` para esta etiqueta si queremos que la analítica solo empiece después del consentimiento.
