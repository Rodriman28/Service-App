import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';

import clienteAxios from "../config/axios";

const NuevoIngreso = (props) => {
  const date_ob = new Date();

  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  const fecha = year + "-" + month + "-" + date;
  const hora = hours + ":" + minutes;

  // Generar State como objeto
  const [ingreso, guardarIngreso] = useState({
    numero_service: "",
    nombre_c: "",
    apellido_c: "",
    telefono: "",
    fecha_ingreso: fecha,
    hora_ingreso: hora,
    marca: "",
    modelo: "",
    falla: "",
    precio: "" + 0,
    seña: "" + 0,
    estado: "Nuevo",
  });

  // Lea los datos del formulario
  const actualizarState = (e) => {
    guardarIngreso({
      ...ingreso,
      [e.target.name]: e.target.value,
    });
  };
  
  const imprimir = () =>{

    clienteAxios.get('/ingresos')
          .then(respuesta => {
          
            const todosIngresos = respuesta.data;
            const ingreso = todosIngresos.reverse();
            const ingreso1 = ingreso[0];
            const saldo = ingreso1.precio - ingreso1.seña + 0;
          
    var doc = new jsPDF();

    // Black square with rounded corners
    doc.roundedRect(10, 8, 190, 65, 3, 3);
    //Titulo
    doc.text(14,16,'Zero Informatica');
    doc.setFontSize(8);
    doc.text(14,20,'18 de Julio 1287 - 4562 1717 - 099 541 939');
    
    doc.setFontSize(12);
    doc.text(14,26, `Nº Service: ${ingreso1.numero_service}`);
    
    //Campos de datos
    doc.setTextColor(50);
    doc.setFontSize(10);
    doc.text(14,32,`Fecha: ${ingreso1.fecha_ingreso} `);
    doc.text(14,36, `Cliente: ${ingreso1.nombre_c} ${ingreso1.apellido_c}` );
    doc.text(14,40, `Marca: ${ingreso1.marca}` );
    doc.text(14,44,`Modelo: ${ingreso1.modelo}`);
    doc.text(14,48,`Falla: ${ingreso1.falla}` );
    doc.text(14,52,`Precio: ${ingreso1.precio}`);
    doc.text(14,56,`Seña: ${ingreso1.seña}`);
    doc.text(14,60, `Saldo: ${saldo}`);
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
    doc.text(14,118,`Nº Service: ${ingreso1.numero_service}`);
    
    //Campos de datos
    doc.setTextColor(50);
    doc.setFontSize(10);
    doc.text(14,124,`Fecha: ${ingreso1.fecha_ingreso} `);
    doc.text(14,128,`Cliente: ${ingreso1.nombre_c} ${ingreso1.apellido_c}`);
    doc.text(14,132, `Marca: ${ingreso1.marca}` );
    doc.text(14,136,`Modelo: ${ingreso1.modelo}`);
    doc.text(14,140,`Falla: ${ingreso1.falla}` );
    doc.text(14,144,`Precio: ${ingreso1.precio}`);
    doc.text(14,148,`Seña: ${ingreso1.seña}`);
    doc.text(14,152, `Saldo: ${saldo}`);
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

  })
  };

  

  // Enviar peticion a la API
  const crearNuevoIngreso = (e) => {
    e.preventDefault();

    Swal.fire({
      title: '¿Desea imprimir el service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, imprimir',
      cancelButtonText: 'No, ir a inicio'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Imprimiendo!'
        )
        clienteAxios.post("/ingresos", ingreso).then((respuesta) => {
          props.guardarConsultar(true);
        }).then(() =>{
          imprimir();
          props.history.push(`/`);
        })
        
            
      } else {
        clienteAxios.post("/ingresos", ingreso).then((respuesta) => {
          props.guardarConsultar(true);
          // Redireccionar
          props.history.push(`/`);
        })
      } 
    })
    
  }; 

  return (
    <Fragment>
      <div className="container-fluid d-flex bg-dark">
        <div className="row text-left text-white">
          <h1 className="font-weight-bold mx-5">Services App</h1>
        </div>
      </div>
      <div className="container">
        <div className="row text-center mt-4">
          <div className="col-12">
            <h1 className="display-5">Nuevo Service</h1>
          </div>
        </div>
      </div>

      <div className="container mt-3 py-3">
        <div className="row">
          <div className="col-md-9 mx-auto">
            <Link to={"/"} className="btn btn-success text-uppercase">
              <i className="bi bi-arrow-left-circle"></i> Volver
            </Link>
          </div>
        </div>
        <div className="col-md-12 mx-auto">
          <div className="col-md-10 mx-auto">
            <form onSubmit={crearNuevoIngreso} className="bg-white p-5">
              <div className="form-group row">
                <div className="col-md-6">
                  <h3 className="text-center">Datos del Cliente</h3>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-group">
                      <span className="input-group-text" id="icono">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="nombre_c"
                        name="nombre_c"
                        placeholder="Nombre"
                        aria-describedby="icono"
                        onChange={actualizarState}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-group">
                      <span className="input-group-text" id="icono">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="apellido_c"
                        name="apellido_c"
                        placeholder="Apellido"
                        onChange={actualizarState}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <div className="input-group">
                      <span className="input-group-text" id="icono">
                        <i className="bi bi-telephone-fill"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="telefono"
                        name="telefono"
                        placeholder="Teléfono"
                        onChange={actualizarState}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="mt-3">
                      <Link to={"/nuevo_cliente"} className="btn btn-warning">
                        Nuevo cliente <i className="bi bi-plus-circle"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h3 className="text-center">Datos del Equipo</h3>

                  <div className="form-group">
                    <label htmlFor="marca">Marca del equipo</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="marca"
                      name="marca"
                      placeholder="Marca"
                      onChange={actualizarState}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modelo">Modelo del equipo</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="modelo"
                      name="modelo"
                      placeholder="Modelo"
                      onChange={actualizarState}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sintomas">Falla del equipo</label>
                    <textarea
                      className="form-control"
                      name="falla"
                      rows="4"
                      onChange={actualizarState}
                    ></textarea>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="precio">Precio de reparacion</label>
                  <div className="input-group">
                    <span className="input-group-text" id="icono">
                      <i className="bi bi-currency-dollar"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="precio"
                      name="precio"
                      placeholder="Precio"
                      onChange={actualizarState}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="seña">Seña</label>
                  <div className="input-group">
                    <span className="input-group-text" id="icono">
                      <i className="bi bi-cash-coin"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="seña"
                      name="seña"
                      placeholder="Seña"
                      onChange={actualizarState}
                    />
                  </div>
                </div>
              </div>
              <input
                type="submit"
                className="btn btn-primary mt-3 w-100 p-3 text-uppercase font-weight-bold"
                value="Ingresar Equipo"
              />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(NuevoIngreso);
