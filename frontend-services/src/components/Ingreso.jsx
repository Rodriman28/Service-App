import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Header from "./Header";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";
import { generarPDFService } from "../utils/pdfGenerator";

const Ingreso = (props) => {
  const [ingreso, setIngreso] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const id = props.match.params.id;
    clienteAxios
      .get(`/ingresos/${id}`)
      .then((respuesta) => {
        setIngreso(respuesta.data);
        setCargando(false);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", "No se pudo cargar el ingreso", "error");
        props.history.push("/");
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

  if (!ingreso) {
    return null;
  }

  const {
    id,
    nombre_c,
    apellido_c,
    numero_service,
    telefono,
    fecha_ingreso,
    hora_ingreso,
    marca,
    modelo,
    falla,
    precio,
    seña,
    estado,
    cliente_id,
  } = ingreso;
  const saldo = parseInt(precio || 0) - parseInt(seña || 0);

  const eliminarIngreso = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Un service eliminado no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "rgba(255, 255, 255, 0.08)",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios
          .delete(`/ingresos/${id}`)
          .then((respuesta) => {
            Swal.fire("Eliminado!", "El service fue eliminado.", "success");
            props.history.push("/");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Error", "No se pudo eliminar el service", "error");
          });
      }
    });
  };

  const cambiarEstado = (nuevoEstado, id) => {
    const payload = { estado: nuevoEstado };

    Swal.fire({
      title: `¿Deseas cambiar el estado a ${nuevoEstado}?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "rgba(255, 255, 255, 0.08)",
      confirmButtonText: "Sí, cambiar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios
          .put(`/ingresos/${id}`, payload)
          .then((respuesta) => {
            Swal.fire("Estado cambiado!", "", "success");
            setIngreso(prev => ({ ...prev, estado: nuevoEstado }));
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Error", "No se pudo cambiar el estado", "error");
          });
      }
    });
  };

  const imprimirOrden = () => {
    generarPDFService({
      numero_service,
      fecha_ingreso,
      nombre_c,
      apellido_c,
      marca,
      modelo,
      falla,
      precio,
      seña,
      saldo,
    });
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case "Reparado":
        return "state-reparado";
      case "Sin arreglo":
        return "state-sin-arreglo";
      case "Avisado":
        return "state-avisado";
      case "Nuevo":
      case "Ingresado":
        return "state-nuevo";
      case "Entregado-Reparado":
      case "Entregado-Sin Arreglo":
      default:
        return "state-entregado";
    }
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <Header
        rightElement={
          <Link to={"/"} className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> Panel Principal
          </Link>
        }
      />

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card card-glass">
              {/* Card Header */}
              <div className="card-header border-0 d-flex justify-content-between align-items-center py-3 bg-dark bg-opacity-30">
                <div className="d-flex flex-column">
                  <span className="fs-5 fw-bold text-white">Service #{numero_service}</span>
                  <span className="small text-muted">{fecha_ingreso} - {hora_ingreso}</span>
                </div>
                <span className={`badge-state ${getBadgeClass(estado)}`}>
                  {estado || 'Nuevo'}
                </span>
              </div>

              {/* Card Body */}
              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  {/* Seccion Cliente */}
                  <div className="col-12 col-md-6 border-end border-secondary border-opacity-25 pr-md-4">
                    <h3 className="h5 text-primary mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-person-fill"></i> Información del Cliente
                    </h3>
                    <div className="mb-3">
                      <label className="text-muted small d-block">Nombre y Apellido</label>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-white fs-6 fw-bold">{nombre_c} {apellido_c}</span>
                        {cliente_id && (
                          <Link to="/clientes" className="badge bg-primary bg-opacity-25 text-primary text-decoration-none px-2 py-1 small">
                            <i className="bi bi-people-fill"></i> Ver Ficha
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small d-block">Teléfono</label>
                      <a href={`tel:${telefono}`} className="text-info fs-6 fw-semibold text-decoration-none d-flex align-items-center gap-1">
                        <i className="bi bi-telephone-fill small"></i> {telefono}
                      </a>
                    </div>
                  </div>

                  {/* Seccion Equipo */}
                  <div className="col-12 col-md-6 pl-md-4">
                    <h3 className="h5 text-primary mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-laptop-fill"></i> Detalles del Equipo
                    </h3>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="text-muted small d-block">Marca</label>
                        <span className="text-white fw-semibold">{marca}</span>
                      </div>
                      <div className="col-6">
                        <label className="text-muted small d-block">Modelo</label>
                        <span className="text-white fw-semibold">{modelo}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted small d-block">Falla Reportada</label>
                      <div className="bg-dark bg-opacity-40 p-3 rounded border border-secondary border-opacity-10 text-white-50 small">
                        {falla}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4 border-secondary border-opacity-20" />

                {/* Sub-tarjeta de Precios */}
                <div className="bg-dark bg-opacity-35 p-3 rounded-3 border border-secondary border-opacity-20 mb-4">
                  <div className="row text-center g-2">
                    <div className="col-4">
                      <span className="text-muted small d-block text-uppercase">Precio</span>
                      <span className="fs-5 fw-bold text-white">${precio}</span>
                    </div>
                    <div className="col-4 border-start border-end border-secondary border-opacity-20">
                      <span className="text-muted small d-block text-uppercase">Seña</span>
                      <span className="fs-5 fw-bold text-warning">${seña}</span>
                    </div>
                    <div className="col-4">
                      <span className="text-muted small d-block text-uppercase">Saldo</span>
                      <span className="fs-5 fw-bold text-success">${saldo}</span>
                    </div>
                  </div>
                </div>

                {/* Cambiar Estado Dropdown */}
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small fw-bold">Actualizar Estado:</span>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-tag-fill"></i> {estado || 'Nuevo'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark border border-secondary border-opacity-20 shadow-lg">
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Nuevo", id)}>Nuevo</button>
                      </li>
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Reparado", id)}>Reparado</button>
                      </li>
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Avisado", id)}>Avisado</button>
                      </li>
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Sin arreglo", id)}>Sin arreglo</button>
                      </li>
                      <li>
                        <hr className="dropdown-divider border-secondary border-opacity-20" />
                      </li>
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Entregado-Reparado", id)}>Entregado-Reparado</button>
                      </li>
                      <li>
                        <button className="dropdown-item" type="button" onClick={() => cambiarEstado("Entregado-Sin Arreglo", id)}>Entregado-Sin Arreglo</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="card-footer border-0 d-flex flex-wrap gap-2 justify-content-between p-4 bg-dark bg-opacity-30">
                <div className="d-flex gap-2">
                  <Link to={`/ingreso/editar/${id}`} className="btn btn-primary btn-sm">
                    <i className="bi bi-pencil-square"></i> Editar
                  </Link>
                  <button className="btn btn-secondary btn-sm" onClick={imprimirOrden}>
                    <i className="bi bi-printer-fill"></i> Imprimir
                  </button>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarIngreso(id)}>
                  <i className="bi bi-trash-fill"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(Ingreso);
