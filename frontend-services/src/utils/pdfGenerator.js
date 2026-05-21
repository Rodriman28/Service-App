import jsPDF from 'jspdf';

export const generarPDFService = (ingreso) => {
  const doc = new jsPDF();
  const precio = parseInt(ingreso.precio || 0);
  const seña = parseInt(ingreso.seña || 0);
  const saldo = precio - seña;

  // Cláusulas legales de los términos y condiciones de Zero Informática
  const lines = [
    '1.- Tiempo de respuesta: El tiempo de demora dependerá exclusivamente del servicio técnico,',
    'y normalmente varía de uno (1) a diez (10) días hábiles, dependiendo del equipo y tipo de',
    'desperfecto. En el caso de que el equipo deba ser derivado a SERVICE AJENO A LA EMPRESA',
    '(por ejemplo: Garantía Oficial), los tiempos de respuesta podrán ser superiores y dependerán de',
    'dicho servicio técnico (hasta 4 meses inclusive). 2.- Retiro del equipo: El plazo de retiro del equipo',
    'dejado en la empresa, tanto para reparaciones realizadas o no, pagas o no, o para la realización',
    'de presupuestos es de 60 días, pasado los mismos la empresa podrá disponer de dicho equipo,',
    'sin que el cliente tenga derecho a reclamación alguna. 3.- Depósito: Transcurridos los 20 días',
    'desde el aviso para el retiro del equipo (reparado o no) la empresa cobrará un depósito diario de',
    '50 pesos uruguayos. 4.- Las reparaciones de equipos MOJADOS (o con humedad de cualquier',
    'tipo) NO CUENTAN CON NINGÚN TIPO DE GARANTÍA, pudiendo incluso los mismos dejar de',
    'funcionar al ingresar al taller. El resto de las reparaciones tienen 30 dias de garantía desde',
    'efectuada la misma (aunque el cliente no retire el equipo). 5.- En los casos de reparaciones de ',
    'equipos con daños físicos (pantalla, carcaza, etc.) los mismos pueden dejar de funcionar ',
    'DEFINITIVA O PARCIALMENTE, sin generar responsabilidad de la empresa. 6.- Los equipos',
    'deberán dejarse SIN CHIP NI MEMORIA, la empresa no se responsabiliza de pérdida o extravío',
    'de los mismos. 7.- En los casos que sea necesario desarmar una notebook/netbook, etc. el mismo',
    'tendrá un costo de 500 pesos, tengan o no reparación. Cuando tengan reparación dicho costo',
    'será parte del precio final informado al cliente. 8.- Es imprescindible presentar este recibo para',
    'retirar el equipo.'
  ];

  // --- COPIA SUPERIOR (Para la empresa/cliente) ---
  // Recuadro negro con esquinas redondeadas
  doc.roundedRect(10, 8, 190, 65, 3, 3);
  
  // Título e Información de contacto
  doc.text(14, 16, 'Zero Informatica');
  doc.setFontSize(8);
  doc.text(14, 20, '18 de Julio 1287 - 4562 1717 - 099 541 939');

  // Número de servicio
  doc.setFontSize(12);
  doc.text(14, 26, `Nº Service: ${ingreso.numero_service || ''}`);

  // Campos de datos del servicio
  doc.setTextColor(50);
  doc.setFontSize(10);
  doc.text(14, 32, `Fecha: ${ingreso.fecha_ingreso || ''}`);
  doc.text(14, 36, `Cliente: ${(ingreso.nombre_c || '').trim()} ${(ingreso.apellido_c || '').trim()}`);
  doc.text(14, 40, `Marca: ${ingreso.marca || ''}`);
  doc.text(14, 44, `Modelo: ${ingreso.modelo || ''}`);
  doc.text(14, 48, `Falla: ${ingreso.falla || ''}`);
  doc.text(14, 52, `Precio: ${precio}`);
  doc.text(14, 56, `Seña: ${seña}`);
  doc.text(14, 60, `Saldo: ${saldo}`);
  
  doc.setTextColor(0);
  doc.text(14, 70, 'Firma ________________');

  // Escribir condiciones en el lado derecho de la copia superior
  doc.setFontSize(8);
  lines.forEach((line, index) => {
    doc.text(75, 14 + index * 3, line);
  });


  // --- COPIA INFERIOR (Para el cliente/empresa) ---
  // Recuadro negro con esquinas redondeadas
  doc.roundedRect(10, 100, 190, 65, 3, 3);
  
  // Título e Información de contacto
  doc.setFontSize(17);
  doc.text(14, 108, 'Zero Informatica');
  doc.setFontSize(8);
  doc.text(14, 112, '18 de Julio 1287 - 4562 1717 - 099 541 939');

  // Número de servicio
  doc.setFontSize(12);
  doc.text(14, 118, `Nº Service: ${ingreso.numero_service || ''}`);

  // Campos de datos del servicio
  doc.setTextColor(50);
  doc.setFontSize(10);
  doc.text(14, 124, `Fecha: ${ingreso.fecha_ingreso || ''}`);
  doc.text(14, 128, `Cliente: ${(ingreso.nombre_c || '').trim()} ${(ingreso.apellido_c || '').trim()}`);
  doc.text(14, 132, `Marca: ${ingreso.marca || ''}`);
  doc.text(14, 136, `Modelo: ${ingreso.modelo || ''}`);
  doc.text(14, 140, `Falla: ${ingreso.falla || ''}`);
  doc.text(14, 144, `Precio: ${precio}`);
  doc.text(14, 148, `Seña: ${seña}`);
  doc.text(14, 152, `Saldo: ${saldo}`);
  
  doc.setTextColor(0);
  doc.text(14, 162, 'Firma ________________');

  // Escribir condiciones en el lado derecho de la copia inferior
  doc.setFontSize(8);
  lines.forEach((line, index) => {
    doc.text(75, 106 + index * 3, line);
  });

  // Imprimir y mostrar en nueva pestaña
  doc.autoPrint();
  doc.output('pdfobjectnewwindow');
};
