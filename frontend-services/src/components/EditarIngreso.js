import React, { Fragment , useState} from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import clienteAxios from '../config/axios';

const EditarIngreso = (props) => {

    const [ingresoEditado, guardarIngresoEditado] = useState({
        nombre_c: "",
        apellido_c: "",
        telefono: "",
        marca: "",
        modelo: "",
        falla: "",
        precio: "" + 0,
        seña: "" + 0
      });
      console.log(props.history);

    const { ingreso: { _id, nombre_c, apellido_c, numero_service, telefono, marca, modelo, falla, precio, seña } } = props;

    if (!props.ingreso) {
        props.history.push(`/`);
        return null;
    }

    

      const actualizarState = (e) => {
        guardarIngresoEditado({
          ...ingresoEditado,
          [e.target.name]: e.target.value,
        });
      };
    

    const guardarCambios = (e) => {
        e.preventDefault();

        const id = props.ingreso._id;

        Swal.fire({
            title: `¿Deseas guardar los cambios?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire(
                'Datos actualizados!'
            )
                console.log(id);
                // cambiar estado del equipo
            clienteAxios.put(`/ingresos/${id}`, ingresoEditado)
                .then(respuesta => {
                    console.log(respuesta)
                    //redireccionar
                    props.history.push(`/ingreso/${id}`);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        })
    }

    return (
        
        

        <Fragment>
            <div className="container-fluid d-flex bg-dark">
                <div className="row text-left text-white">
                    <h1 className="font-weight-bold mx-5">Services App</h1>
                </div>
            </div>
            <div className="container">
                <div className="row  text-center mt-4">
                    <div className="col-12">
                        <h1 className="display-5">Editar service N° {numero_service}</h1>
                    </div>

                </div>
            </div>
            <div className="container mt-3 py-3">
                <div className="row">
                    <div className="col-md-8 mx-auto">

                        <Link to={`/ingreso/${_id}`} key={_id} className="btn btn-success text-uppercase"><i className="bi bi-arrow-left-circle"></i> Volver</Link>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-9 mx-auto">
                    <form
                            onSubmit={guardarCambios}
                            className="bg-white p-5 bordered">

                            <div className="form-group row">

                                <div className="col-md-6">
                                    <h3 className="text-center">Datos del Cliente</h3>
                                    <div className="form-group">

                                        <label htmlFor="nombre">Nombre</label>
                                        <div className="input-group">
                                            <span className="input-group-text" id="icono"><i className="bi bi-person-fill"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                id="nombre_c"
                                                name="nombre_c"
                                                placeholder="Nombre"
                                                defaultValue={nombre_c}
                                                aria-describedby="icono"
                                                onChange={actualizarState}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="apellido">Apellido</label>
                                        <div className="input-group">
                                            <span className="input-group-text" id="icono"><i className="bi bi-person-fill"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                id="apellido_c"
                                                name="apellido_c"
                                                placeholder="Apellido"
                                                defaultValue={apellido_c}
                                                onChange={actualizarState}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telefono">Teléfono</label>
                                        <div className="input-group">
                                            <span className="input-group-text" id="icono"><i className="bi bi-telephone-fill"></i></span>
                                            <input
                                                type="tel"
                                                className="form-control form-control-lg"
                                                id="telefono"
                                                name="telefono"
                                                placeholder="Teléfono"
                                                defaultValue={telefono}
                                                onChange={actualizarState}
                                            />
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
                                            defaultValue={marca}
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
                                            defaultValue={modelo}
                                            onChange={actualizarState}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="sintomas">Falla del equipo</label>
                                        <textarea
                                            className="form-control"
                                            name="falla"
                                            rows="4"
                                            defaultValue={falla}
                                            onChange={actualizarState}
                                        ></textarea>
                                    </div>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="precio">Precio de reparacion</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="icono"><i className="bi bi-currency-dollar"></i></span>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg"
                                            id="precio"
                                            name="precio"
                                            placeholder="Precio"
                                            defaultValue={precio}
                                            onChange={actualizarState}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="seña">Seña</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="icono"><i className="bi bi-cash-coin"></i></span>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg"
                                            id="seña"
                                            name="seña"
                                            placeholder="Seña"
                                            defaultValue={seña}
                                            onChange={actualizarState}
                                        />
                                    </div>
                                </div>
                            </div>
                            <input type="submit" className="btn btn-primary mt-3 w-100 p-3 text-uppercase font-weight-bold" value="Confirmar Cambios" />
                        </form>
                    </div>

                </div>
            </div>
        </Fragment>

    );
}

export default EditarIngreso;