# Cifria - Fase 29

## Qué cambia

- Nueva dirección visual editorial/minimalista para header, home, secciones, tarjetas y footer.
- Responsive revisado en desktop y móvil.
- Aviso legal, privacidad y cookies con estructura más limpia.
- Los datos personales no se insertan en el código: el sitio usa un nombre de proyecto y un campo de domicilio profesional pendiente.
- Google Tag Manager (`GTM-N6SL9MLZ`) se carga solo después del consentimiento de analítica; no se incluye un snippet noscript incondicional para evitar cargar el contenedor antes de la decisión del usuario.

## Antes de publicar

Completar `src/data/legal.ts` con los datos legales que deban hacerse públicos. No uses un domicilio particular si existe un domicilio profesional válido para la actividad, pero la normativa aplicable debe revisarse con un profesional antes de monetizar.

## Google Analytics

El contenedor de GTM ya está preparado en la interfaz. En Google Tag Manager hay que crear/configurar la etiqueta de Google Analytics 4 y su activador de consentimiento según la configuración de consentimiento que corresponda. El ID de contenedor no es un secreto.
