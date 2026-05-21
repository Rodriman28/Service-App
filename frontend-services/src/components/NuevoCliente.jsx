import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Header from './Header';
import Swal from 'sweetalert2';
import clienteAxios from '../config/axios';

const NuevoCliente = (props) => {
  const [cliente, guardarCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    cedula: ""
  });

  const actualizarState = (e) => {
    guardarCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const crearCliente = (e) => {
    e.preventDefault();
    
    if (!cliente.nombre.trim() || !cliente.apellido.trim() || !cliente.telefono.trim()) {
      Swal.fire("Campos obligatorios", "Por favor, completa Nombre, Apellido y Teléfono", "warning");
      return;
    }

    clienteAxios.post('/clientes', cliente)
      .then(respuesta => {
        Swal.fire("¡Éxito!", "Cliente registrado correctamente", "success");
        props.history.goBack();
      })
      .catch(error => {
        console.log(error);
        Swal.fire("Error", "No se pudo registrar al cliente", "error");
      });
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <Header
        rightElement={
          <button onClick={() => props.history.goBack()} className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> Volver
          </button>
        }
      />

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card card-glass p-4 p-md-5">
              <h2 className="text-center text-white mb-4">Registrar Cliente Frecuente</h2>

              <form onSubmit={crearCliente}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label text-muted small fw-semibold">Nombre</label>
                  <div className="input-group">
                    <span className="input-group-text border-0"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre"
                      onChange={actualizarState}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="apellido" className="form-label text-muted small fw-semibold">Apellido</label>
                  <div className="input-group">
                    <span className="input-group-text border-0"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      placeholder="Apellido"
                      onChange={actualizarState}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label text-muted small fw-semibold">Teléfono</label>
                  <div className="input-group">
                    <span className="input-group-text border-0"><i className="bi bi-telephone"></i></span>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono de contacto"
                      onChange={actualizarState}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="cedula" className="form-label text-muted small fw-semibold">Cédula / DNI (Opcional)</label>
                  <div className="input-group">
                    <span className="input-group-text border-0"><i className="bi bi-card-text"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      id="cedula"
                      name="cedula"
                      placeholder="Documento de identidad"
                      onChange={actualizarState}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-success w-100 justify-content-center p-3 text-uppercase">
                    <i className="bi bi-person-check-fill fs-5"></i> Guardar Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(NuevoCliente);