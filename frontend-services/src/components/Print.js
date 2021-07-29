import React, { Fragment } from "react";
import jsPDF from 'jspdf';


const Print = () => {

    const imprimir = () => {

        

        var doc = new jsPDF();

// Black square with rounded corners
doc.roundedRect(10, 8, 190, 65, 3, 3);
//Titulo
doc.text(14,16,'Zero Informatica');
doc.setFontSize(8);
doc.text(14,20,'18 de Julio 1287 - 4562 1717 - 099 541 939');

doc.setFontSize(12);
doc.text(14,26,'Nº Service: 7625');

//Campos de datos
doc.setTextColor(50);
doc.setFontSize(10);
doc.text(14,32,'Fecha:');
doc.text(14,36,'Cliente:');
doc.text(14,40,'Marca:');
doc.text(14,44,'Modelo:');
doc.text(14,48,'Falla:');
doc.text(14,52,'Precio:');
doc.text(14,56,'Seña:');
doc.text(14,60,'Saldo:');
doc.setTextColor(0);
doc.text(14,70,'Firma ________________');

//Condiciones
doc.setFontSize(8)
doc.text(75,14,'1.- Tiempo de respuesta: El tiempo de demora dependerá exclusivamente del servicio técnico,')
doc.text(75,17,'y normalmente varía de uno (1) a diez (10) días hábiles, dependiendo del equipo y tipo de')
doc.text(75,20,'desperfecto. En el caso de que el equipo deba ser derivado a SERVICE AJENO A LA EMPRESA')
doc.text(75,23,'(por ejemplo: Garantía Oficial), los tiempos de respuesta podrán ser superiores y dependerán de')
doc.text(75,26,'dicho servicio técnico (hasta 4 meses inclusive). 2.- Retiro del equipo: El plazo de retiro del equipo')
doc.text(75,29,'dejado en la empresa, tanto para reparaciones realizadas o no, pagas o no, o para la realización')
doc.text(75,32,'de presupuestos es de 60 días, pasado los mismos la empresa podrá disponer de dicho equipo,')
doc.text(75,35,'sin que el cliente tenga derecho a reclamación alguna. 3.- Depósito: Transcurridos los 20 días')
doc.text(75,38,'desde el aviso para el retiro del equipo (reparado o no) la empresa cobrará un depósito diario de')
doc.text(75,41,'50 pesos uruguayos. 4.- Las reparaciones de equipos MOJADOS (o con humedad de cualquier')
doc.text(75,44,'tipo) NO CUENTAN CON NINGÚN TIPO DE GARANTÍA, pudiendo incluso los mismos dejar de')
doc.text(75,47,'funcionar al ingresar al taller. El resto de las reparaciones tienen 30 dias de garantía desde')
doc.text(75,50,'efectuada la misma (aunque el cliente no retire el equipo). 5.- En los casos de reparaciones de ')
doc.text(75,53,'equipos con daños físicos (pantalla, carcaza, etc.) los mismos pueden dejar de funcionar ')
doc.text(75,56,'DEFINITIVA O PARCIALMENTE, sin generar responsabilidad de la empresa. 6.- Los equipos')
doc.text(75,59,'deberán dejarse SIN CHIP NI MEMORIA, la empresa no se responsabiliza de pérdida o extravío')
doc.text(75,62,'de los mismos. 7.- En los casos que sea necesario desarmar una notebook/netbook, etc. el mismo')
doc.text(75,65,'tendrá un costo de 500 pesos, tengan o no reparación. Cuando tengan reparación dicho costo');
doc.text(75,68,'será parte del precio final informado al cliente. 8.- Es imprescindible presentar este recibo para');
doc.text(75,71,'retirar el equipo.')


doc.roundedRect(10, 100 , 190, 65, 3, 3);

//Titulo
doc.setFontSize(17)
doc.text(14,108,'Zero Informatica');
doc.setFontSize(8);
doc.text(14,112,'18 de Julio 1287 - 4562 1717 - 099 541 939');

doc.setFontSize(12);
doc.text(14,118,'Nº Service: 7625');

//Campos de datos
doc.setTextColor(50);
doc.setFontSize(10);
doc.text(14,124,'Fecha:');
doc.text(14,128,'Cliente:');
doc.text(14,132,'Marca:');
doc.text(14,136,'Modelo:');
doc.text(14,140,'Falla:');
doc.text(14,144,'Precio:');
doc.text(14,148,'Seña:');
doc.text(14,152,'Saldo:');
doc.setTextColor(0);
doc.text(14,162,'Firma ________________');


//Condiciones
doc.setFontSize(8)
doc.text(75,106,'1.- Tiempo de respuesta: El tiempo de demora dependerá exclusivamente del servicio técnico,')
doc.text(75,109,'y normalmente varía de uno (1) a diez (10) días hábiles, dependiendo del equipo y tipo de')
doc.text(75,112,'desperfecto. En el caso de que el equipo deba ser derivado a SERVICE AJENO A LA EMPRESA')
doc.text(75,115,'(por ejemplo: Garantía Oficial), los tiempos de respuesta podrán ser superiores y dependerán de')
doc.text(75,118,'dicho servicio técnico (hasta 4 meses inclusive). 2.- Retiro del equipo: El plazo de retiro del equipo')
doc.text(75,121,'dejado en la empresa, tanto para reparaciones realizadas o no, pagas o no, o para la realización')
doc.text(75,124,'de presupuestos es de 60 días, pasado los mismos la empresa podrá disponer de dicho equipo,')
doc.text(75,127,'sin que el cliente tenga derecho a reclamación alguna. 3.- Depósito: Transcurridos los 20 días')
doc.text(75,130,'desde el aviso para el retiro del equipo (reparado o no) la empresa cobrará un depósito diario de')
doc.text(75,133,'50 pesos uruguayos. 4.- Las reparaciones de equipos MOJADOS (o con humedad de cualquier')
doc.text(75,136,'tipo) NO CUENTAN CON NINGÚN TIPO DE GARANTÍA, pudiendo incluso los mismos dejar de')
doc.text(75,139,'funcionar al ingresar al taller. El resto de las reparaciones tienen 30 dias de garantía desde')
doc.text(75,142,'efectuada la misma (aunque el cliente no retire el equipo). 5.- En los casos de reparaciones de ')
doc.text(75,145,'equipos con daños físicos (pantalla, carcaza, etc.) los mismos pueden dejar de funcionar ')
doc.text(75,148,'DEFINITIVA O PARCIALMENTE, sin generar responsabilidad de la empresa. 6.- Los equipos')
doc.text(75,151,'deberán dejarse SIN CHIP NI MEMORIA, la empresa no se responsabiliza de pérdida o extravío')
doc.text(75,154,'de los mismos. 7.- En los casos que sea necesario desarmar una notebook/netbook, etc. el mismo')
doc.text(75,157,'tendrá un costo de 500 pesos, tengan o no reparación. Cuando tengan reparación dicho costo');
doc.text(75,160,'será parte del precio final informado al cliente. 8.- Es imprescindible presentar este recibo para');
doc.text(75,163,'retirar el equipo.')

doc.autoPrint();
doc.output('pdfobjectnewwindow');
    } 

  return (
    <Fragment>
      <button className="btn btn-primary" onClick={() => imprimir()}>
        Guardar PDF
      </button>
    </Fragment>
  );
};
export default Print;
