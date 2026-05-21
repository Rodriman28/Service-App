import React, { Fragment } from "react";
import { generarPDFService } from "../utils/pdfGenerator";


const Print = () => {

    const imprimir = () => {
        generarPDFService({
            numero_service: 7625,
            fecha_ingreso: '',
            nombre_c: '',
            apellido_c: '',
            marca: '',
            modelo: '',
            falla: '',
            precio: 0,
            seña: 0
        });
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
