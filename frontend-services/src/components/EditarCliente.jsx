import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Header from './Header';
import Swal from 'sweetalert2';
import clienteAxios from '../config/axios';

const EditarCliente = (props) => {
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const id = props.match.params.id;
    clienteAxios.get(`/clientes/${id}`)
      .then(respuesta => {
        setCliente({
          nombre: respuesta.data.nombre || "",
          apellido: respuesta.data.apellido || "",
          telefono: respuesta.data.telefono || "",
          cedula: respuesta.data.cedula || ""
        });
        setCargando(false);
      })
      .catch(error => {
        console.log(error);
        Swal.fire("Error", "No se pudo obtener la información del cliente", "error");
        props.history.push('/clientes');
      });
  }, [props.match.params.id, props.history]);

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const actualizarState = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const guardarCambios = (e) => {
    e.preventDefault();

    if (!cliente.nombre.trim() || !cliente.apellido.trim() || !cliente.telefono.trim()) {
      Swal.fire("Campos obligatorios", "Por favor completa Nombre, Apellido y Teléfono", "warning");
      return;
    }

    const id = props.match.params.id;
    clienteAxios.put(`/clientes/${id}`, cliente)
      .then(respuesta => {
        Swal.fire("Éxito", "Los datos del cliente han sido actualizados", "success");
        props.history.push('/clientes');
      })
      .catch(error => {
        console.log(error);
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      });
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <Header
        rightElement={
          <Link to={'/clientes'} className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> Cancelar
          </Link>
        }
      />

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card card-glass p-4 p-md-5">
              <h2 className="text-center text-white mb-4">Editar Cliente Frecuente</h2>

              <form onSubmit={guardarCambios}>
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
                      value={cliente.nombre}
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
                      value={cliente.apellido}
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
                      value={cliente.telefono}
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
                      value={cliente.cedula}
                      onChange={actualizarState}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary w-100 justify-content-center p-3 text-uppercase">
                    <i className="bi bi-check-circle-fill fs-5"></i> Guardar Cambios
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

export default withRouter(EditarCliente);
