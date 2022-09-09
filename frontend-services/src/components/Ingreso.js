import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";
import jsPDF from "jspdf";

//prettier-ignore
const Ingreso = (props) => {

    if (!props.ingreso) {
        props.history.push('/');
        return null;
    }

    const { ingreso: { _id, nombre_c, apellido_c, numero_service, telefono, fecha_ingreso, hora_ingreso, marca, modelo, falla, precio, seña, estado } } = props;
    const saldo = parseInt(precio) - parseInt(seña);
    
    

    const eliminarIngreso = id => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Un service eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // alerta de eliminado
                Swal.fire(
                    'Eliminado!',
                    'El service fue eliminado.',
                    'success'
                )
                // eliminado de la base de datos
                clienteAxios.delete(`/ingresos/${id}`)
                    .then(respuesta => {
                        console.log(respuesta)
                        props.guardarConsultar(true);
                        //redireccionar
                        props.history.push('/');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
    }

    const cambiarEstado = (nuevoEstado,id) => {

        const ingreso = {estado: nuevoEstado};

        Swal.fire({
            title: `¿Deseas cambiar el estado a ${nuevoEstado}?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, cambiar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Estado cambiado!'
              )
                // cambiar estado del equipo
                clienteAxios.put(`/ingresos/${id}`,ingreso)
                    .then(respuesta => {
                        console.log(respuesta)
                        props.guardarConsultar(true);
                        //redireccionar
                        props.history.push('/');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
          })
    }

    const ingreso1 ={numero_service, fecha_ingreso, nombre_c, apellido_c, marca, modelo, falla, precio, seña, saldo } ;
    const imprimirOrden = (ingreso) => {

        var doc = new jsPDF();

// Black square with rounded corners
doc.roundedRect(10, 8, 190, 65, 3, 3);
//Titulo
doc.text(14,16,'Zero Informatica');
doc.setFontSize(8);
doc.text(14,20,'18 de Julio 1287 - 4562 1717 - 099 541 939');

doc.setFontSize(12);
doc.text(14,26, `Nº Service: ${ingreso.numero_service}`);

//Campos de datos
doc.setTextColor(50);
doc.setFontSize(10);
doc.text(14,32,`Fecha: ${ingreso.fecha_ingreso} `);
doc.text(14,36, `Cliente: ${ingreso.nombre_c} ${ingreso.apellido_c}` );
doc.text(14,40, `Marca: ${ingreso.marca}` );
doc.text(14,44,`Modelo: ${ingreso.modelo}`);
doc.text(14,48,`Falla: ${ingreso.falla}` );
doc.text(14,52,`Precio: ${ingreso.precio}`);
doc.text(14,56,`Seña: ${ingreso.seña}`);
doc.text(14,60, `Saldo: ${ingreso.saldo}`);
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
doc.text(14,118,`Nº Service: ${ingreso.numero_service}`);

//Campos de datos
doc.setTextColor(50);
doc.setFontSize(10);
doc.text(14,124,`Fecha: ${ingreso.fecha_ingreso} `);
doc.text(14,128,`Cliente: ${ingreso.nombre_c} ${ingreso.apellido_c}`);
doc.text(14,132, `Marca: ${ingreso.marca}` );
doc.text(14,136,`Modelo: ${ingreso.modelo}`);
doc.text(14,140,`Falla: ${ingreso.falla}` );
doc.text(14,144,`Precio: ${ingreso.precio}`);
doc.text(14,148,`Seña: ${ingreso.seña}`);
doc.text(14,152, `Saldo: ${ingreso.saldo}`);
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
    

    if (!props.ingreso) {
        props.history.push('/');
        return null;
    }
    
    return (
        <Fragment>
            <div className="container-fluid d-flex bg-dark">
                <div className="row text-left text-white">
                    <h1 className="font-weight-bold mx-5">Services App</h1>
                </div>
            </div>
            
            <div className="container mt-3 py-3">
                <div className="row">
                    <div className="col-md-6 mx-auto">

                        <Link to={'/'} className="btn btn-success text-uppercase"><i className="bi bi-arrow-left-circle"></i> Volver</Link>
                    </div>
                </div>
                <div className="row d-flex justify-content-center py-5">
                    <div className="col-6">
                        <div className="card">

                            <div className="card-header bg-dark display-6 fw-bold text-center text-white">Numero de service: {numero_service}</div>
                            <div className="card-body px-5 border border-dark ">
                                <div className=" d-flex justify-content-end" >
                                <p>{fecha_ingreso} - {hora_ingreso}</p>
                                </div>
                                
                                <h3 id="clienteTitulo" className="card-title fw-bold">Cliente</h3>
                                <hr className="w-50" />
                                <p><span className="fw-bold">Nombre y Apellido:</span> {nombre_c} {apellido_c}</p>
                                <p><span className="fw-bold">Teléfono:</span> {telefono}</p>
                                <hr />
                                <h3 className="card-title fw-bold">Equipo</h3>
                                <hr className="w-50" />
                                <p><span className="fw-bold">Marca:</span> {marca}</p>
                                <p><span className="fw-bold">Modelo:</span> {modelo}</p>
                                <p><span className="fw-bold">Falla:</span> {falla}</p>
                                <hr className="w-50" />
                                <p><span className="fw-bold">Precio:</span> {precio}</p>
                                <p><span className="fw-bold">Seña:</span> {seña}</p>
                                <p><span className="fw-bold">Saldo:</span> {saldo}</p>
                                <hr/>
                                <p><span className="fw-bold">Estado:</span> {estado}</p>
                                <div className="btn-group dropend">
                                    <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Cambiar estado</button>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Reparado',_id)}>Reparado</button></li>
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Sin arreglo',_id)}>Sin arreglo</button></li>
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Entregado-Reparado',_id)}>Entregado-Reparado</button></li>
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Entregado-Sin Arreglo',_id)}>Entregado-Sin Arreglo</button></li>
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Nuevo',_id)}>Nuevo</button></li>
                                    <li><button className="dropdown-item" type="button" onClick={ () => cambiarEstado('Avisado',_id)}>Avisado</button></li>

                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer d-flex px-5 justify-content-between bg-dark">
                                <Link to={`/ingreso/editar/${_id}`} key={_id} className="btn btn-primary text-uppercase" >Editar <i className="bi bi-pencil-square"></i></Link>
                                <button className="btn btn-secondary text-uppercase" onClick={ ()=> imprimirOrden(ingreso1)} >Imprimir <i className="bi bi-printer"></i></button>
                                <button className="btn btn-danger text-uppercase" onClick={ () => eliminarIngreso(_id)}>Eliminar <i className="bi bi-x-circle"></i></button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>




        </Fragment>


    );
}

export default withRouter(Ingreso);
