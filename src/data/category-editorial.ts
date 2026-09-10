import type { Category } from './categories';

interface CategoryEditorial {
  sections: { title: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
}

export const categoryEditorial: Record<Category['slug'], CategoryEditorial> = {
  vivienda: {
    sections: [
      { title: 'De la búsqueda de vivienda al importe de la hipoteca', paragraphs: [
        'Las calculadoras para comprar vivienda permiten separar el precio del inmueble del dinero que necesitas pedir prestado. Empieza por el precio y la entrada, y reserva aparte los gastos de adquisición. Si introduces como préstamo todo el precio de una casa a la que aportarás ahorros, sobreestimarás la cuota que corresponde a tu operación.',
        'Después compara plazos con el mismo capital y tipo. Una hipoteca a veinte años concentra la devolución en menos pagos; una de treinta prolonga la deuda. Mira la mensualidad, los intereses acumulados y el saldo pendiente en el año en que podrías vender o cambiar de vivienda.'
      ] },
      { title: 'Si la compra se destina al alquiler', paragraphs: [
        'La rentabilidad del alquiler responde a otra pregunta: qué relación existe entre las rentas y el coste del inmueble. Reúne el alquiler previsto, los meses ocupados y los gastos del propietario. Una renta anual dividida entre el precio solo describe una rentabilidad bruta y puede ocultar reparaciones, periodos vacíos o desembolsos iniciales.',
        'El rendimiento del inmueble y el dinero que queda en tu cuenta no son lo mismo si existe financiación. La cuota de hipoteca incluye devolución de capital además de intereses. Mantén separada la comparación de rentabilidad de la previsión mensual de cobros y pagos.'
      ] }
    ],
    faqs: [
      { question: '¿El precio de la vivienda es el capital de la hipoteca?', answer: 'Solo si financias todo ese precio. Con una entrada de ahorro, resta esa aportación para obtener el principal y presupuesta los gastos de compra por separado.' },
      { question: '¿Una cuota menor implica pagar menos por la financiación?', answer: 'No necesariamente. Alargar el plazo reduce el recibo en el modelo de cuota constante, pero mantiene la deuda durante más tiempo y puede elevar los intereses totales.' },
      { question: '¿La rentabilidad bruta del alquiler incluye los gastos?', answer: 'No. Para acercarte al rendimiento después de gastos necesitas incorporarlos expresamente y contemplar los meses sin inquilino; no basta con multiplicar una renta mensual por doce.' }
    ]
  },
  prestamos: {
    sections: [
      { title: 'Qué importe necesitas recibir y cuánto devolverás', paragraphs: [
        'Las calculadoras de préstamos personales ayudan a traducir un capital, un tipo fijo y un plazo en una mensualidad. Introduce el importe que se financiará realmente: si una comisión se añade al préstamo, el principal será mayor que el dinero destinado a la compra. Si se paga al inicio, habrá un desembolso adicional fuera de las cuotas.',
        'Compara el total de pagos de cada alternativa, no solo el recibo más pequeño. Un préstamo a cinco años tiene sesenta mensualidades y uno a siete tiene ochenta y cuatro. Multiplicar ambos recibos por el mismo número de meses ocultaría parte del coste de la opción larga.'
      ] },
      { title: 'Antes de realizar una amortización extraordinaria', paragraphs: [
        'Para estudiar una devolución anticipada utiliza el saldo pendiente actual y el plazo que queda. El importe original dejó de representar la deuda después de pagar las primeras cuotas. Comprueba también si el contrato contempla un coste por amortizar y cuánto dinero quedaría disponible después de abonarlo.',
        'Reducir cuota y reducir plazo producen calendarios diferentes. La primera opción libera presupuesto en próximos recibos; la segunda adelanta el final de la deuda. Guarda ambos resultados para contrastar el ahorro de intereses con el esfuerzo mensual que puedes sostener hasta terminar de pagar.'
      ] }
    ],
    faqs: [
      { question: '¿Puedo introducir la TAE como si fuera el TIN?', answer: 'No son intercambiables. La cuota del modelo se calcula con el tipo nominal; la TAE sirve para expresar el coste anual equivalente bajo sus condiciones e incorpora otros elementos de la oferta.' },
      { question: '¿Qué cambia si financio una comisión de apertura?', answer: 'Aumenta el principal a devolver. Si la pagas con tus ahorros, el principal no aumenta, pero debes sumar ese pago inicial al coste de la operación.' },
      { question: '¿La simulación sirve para un préstamo con pago final elevado?', answer: 'El modelo de cuota constante no representa por sí solo un calendario con una última cuota distinta. Necesitas revisar ese pago final y el cuadro específico de la oferta.' }
    ]
  },
  'ahorro-inversion': {
    sections: [
      { title: 'Elegir entre calcular una meta o proyectar un saldo', paragraphs: [
        'Las calculadoras de ahorro e inversión resuelven preguntas distintas. Si conoces la cantidad que necesitas y la fecha, empieza por objetivo de ahorro para estimar la aportación. Si ya sabes cuánto puedes apartar cada mes, utiliza aportaciones periódicas o interés compuesto para proyectar el capital bajo una hipótesis de rentabilidad.',
        'En ambos casos separa el dinero que aportas del rendimiento calculado. Aportar 200 euros al mes durante diez años suma 24.000 euros sin capital inicial. Cualquier crecimiento adicional de la simulación depende de la rentabilidad y de cuándo se incorpora cada ingreso, no de haber ahorrado una cantidad mayor.'
      ] },
      { title: 'Comparar rendimiento, duración y poder de compra', paragraphs: [
        'El ROI expresa una relación entre beneficio e inversión, pero por sí solo no dice cuánto tiempo ha requerido obtenerla. Un mismo porcentaje en un año y en cinco años describe resultados distintos. Para una comparación útil, anota junto al rendimiento el periodo y los costes que has incluido.',
        'La calculadora de inflación permite mirar el poder adquisitivo de un saldo. Tener más euros al final no garantiza poder comprar más si los precios también aumentan. No interpretes una trayectoria de interés constante como previsión de mercado: una inversión real puede fluctuar y las retiradas reducen el capital que sigue generando rendimientos.'
      ] }
    ],
    faqs: [
      { question: '¿Qué herramienta uso si quiero reunir una cantidad en una fecha?', answer: 'Objetivo de ahorro permite relacionar meta, capital inicial y plazo. Así puedes comprobar qué aportación necesitarías en lugar de elegir un rendimiento alto para cuadrar el resultado.' },
      { question: '¿Un ROI del 10 % significa ganar un 10 % cada año?', answer: 'No necesariamente. El ROI corresponde al periodo considerado; debes conocer su duración antes de compararlo con una rentabilidad anual.' },
      { question: '¿El saldo calculado tiene descontada la inflación?', answer: 'Una proyección nominal muestra euros del momento futuro. Para estudiar su poder de compra necesitas incorporar una hipótesis de inflación y mantener claro el periodo al que corresponde.' }
    ]
  },
  nomina: {
    sections: [
      { title: 'Preparar dos ofertas para compararlas por hora', paragraphs: [
        'Las calculadoras de nómina y salario permiten obtener una referencia horaria a partir de la remuneración bruta anual y la jornada. Empieza por reunir el fijo anual completo, incluidas las pagas extraordinarias. Un sueldo mensual aislado puede dar una comparación equivocada si una oferta se cobra en doce pagas y otra en catorce.',
        'Anota después las horas semanales y las semanas utilizadas. Con cuarenta horas y 52 semanas, el denominador es de 2.080 horas. Si descuentas semanas para estimar trabajo efectivo, aplica ese mismo criterio a todas las ofertas. Cambiar el calendario solo en una de ellas altera la comparación aunque el salario sea idéntico.'
      ] },
      { title: 'Separar remuneración garantizada, variable y tiempo', paragraphs: [
        'Si existe un bonus sujeto a objetivos, calcula primero la referencia con el fijo y después una hipótesis que incluya el variable. Esto permite distinguir lo que está garantizado de lo que depende del cumplimiento de condiciones. Haz lo mismo con horas extra o guardias que no estén incluidas en la jornada habitual.',
        'El resultado bruto por hora no predice cuánto ingresarás en tu cuenta ni determina el precio legal de una hora extraordinaria. Tampoco recoge automáticamente el tiempo de desplazamiento. Puedes valorar ese tiempo por separado al decidir entre empleos, manteniendo visible la diferencia entre jornada contractual y dedicación total.'
      ] }
    ],
    faqs: [
      { question: '¿Catorce pagas aumentan el salario por hora?', answer: 'No si el bruto anual es el mismo. Cambia la distribución de los cobros, pero la remuneración total dividida entre las mismas horas produce la misma referencia.' },
      { question: '¿Reducir de 40 a 35 horas aumenta siempre el valor horario?', answer: 'Solo si el salario no disminuye en la misma proporción. Introduce tanto el nuevo bruto anual como la nueva jornada para comprobar qué ocurre en la oferta concreta.' },
      { question: '¿Puedo usar el resultado como salario neto?', answer: 'No. El cálculo parte del bruto y no reproduce las retenciones, cotizaciones y circunstancias que intervienen en una nómina real.' }
    ]
  },
  impuestos: {
    sections: [
      { title: 'Una operación de IVA y una estimación de IRPF no son lo mismo', paragraphs: [
        'Las calculadoras de impuestos en España reúnen operaciones que necesitan datos diferentes. Para el IVA, identifica primero si el precio es una base sin impuesto o un total que ya lo contiene. Después selecciona el porcentaje que corresponda a la operación; la calculadora realiza la cuenta, pero no clasifica el producto ni determina su tratamiento fiscal.',
        'Con una base hipotética de 100 euros y un tipo del 21 %, el total es de 121 euros. Para recuperar la base desde ese total, divide entre 1,21. Restar el 21 % de 121 aplicaría el porcentaje a una cantidad diferente y no devolvería los 100 euros originales.'
      ] },
      { title: 'Preparar los datos de una estimación de la renta', paragraphs: [
        'El IRPF requiere distinguir ingresos, cotizaciones, retenciones y circunstancias personales. Las retenciones son cantidades ya ingresadas a cuenta: no deben confundirse con el impuesto total estimado. Dos personas con una misma cuota calculada pueden obtener balances diferentes si les han retenido importes distintos.',
        'La herramienta de Cifria identifica el ejercicio 2025 y utiliza un modelo simplificado. No incorpora escalas, mínimos ni deducciones autonómicos ni reproduce los regímenes forales. Utiliza el resultado para revisar los datos introducidos y confirma la declaración con el servicio de la administración tributaria que corresponda a tu caso.'
      ] }
    ],
    faqs: [
      { question: '¿Quitar IVA es aplicar un descuento del mismo porcentaje?', answer: 'No. Para extraer un IVA incluido divides el total entre uno más el tipo expresado en decimal. Un descuento calcula el porcentaje sobre el precio del que partes.' },
      { question: '¿La calculadora decide qué tipo de IVA lleva una factura?', answer: 'No. Debes comprobar el tipo aplicable antes de introducirlo. Si hay líneas con porcentajes diferentes, separa sus bases en lugar de tratar toda la factura como una sola operación.' },
      { question: '¿La estimación de IRPF sustituye al borrador oficial?', answer: 'No. Su alcance simplificado deja fuera circunstancias y reglas territoriales. Contrasta ingresos y retenciones y utiliza el servicio oficial para preparar y presentar la declaración.' }
    ]
  },
  coche: {
    sections: [
      { title: 'Presupuestar una salida o medir el coste de tener coche', paragraphs: [
        'Las calculadoras de costes del coche separan el combustible de un trayecto del coste de uso del vehículo. Para un viaje necesitas distancia total, consumo en litros por cien kilómetros y precio por litro. Si el recorrido incluye regreso, suma ambas distancias o utiliza la opción correspondiente sin duplicar dos veces los kilómetros.',
        'Una ruta hipotética de 500 kilómetros a 6 litros por cien requiere 30 litros. Multiplica esos litros por el precio que utilizarás en el presupuesto. Peajes y aparcamiento son partidas adicionales: que el combustible salga barato no significa que el desplazamiento completo tenga ese mismo coste.'
      ] },
      { title: 'Repartir los gastos anuales entre kilómetros', paragraphs: [
        'Para comparar el coche con otras formas de desplazarte, añade seguro, mantenimiento, neumáticos y depreciación a las partidas que contemple el modelo. Los gastos anuales se reparten entre los kilómetros de ese año. Si recorres pocos kilómetros, cada uno soporta una parte mayor de los costes fijos, aunque el consumo de combustible sea idéntico.',
        'Distingue el coste medio por kilómetro del gasto adicional de hacer un viaje. El seguro puede pagarse aunque dejes el coche aparcado, mientras que el combustible depende del recorrido. Esta diferencia importa tanto al decidir si conservar el vehículo como al acordar qué gastos compartir con los pasajeros de una salida concreta.'
      ] }
    ],
    faqs: [
      { question: '¿Qué consumo debo poner si hago ciudad y carretera?', answer: 'Usa una media representativa del recorrido previsto o calcula los tramos por separado. El consumo de un trayecto anterior muy distinto puede desviar el presupuesto.' },
      { question: '¿Por qué sube el coste por kilómetro si conduzco menos?', answer: 'Porque los gastos fijos anuales se reparten entre menos kilómetros. No significa necesariamente que cada trayecto consuma más combustible.' },
      { question: '¿Repartir gasolina equivale a repartir todo el coste del coche?', answer: 'No. Es un acuerdo limitado al combustible. Peajes, aparcamiento y otras partidas deben identificarse aparte si queréis incluirlas en el reparto.' }
    ]
  }
};
