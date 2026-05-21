import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import io from "socket.io-client";
import clienteAxios from "../config/axios";
import Header from "./Header";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const CLIENTES_POR_PAGINA = 50;

  const obtenerClientes = () => {
    setCargando(true);
    clienteAxios
      .get("/clientes")
      .then((respuesta) => {
        setClientes(respuesta.data);
        setCargando(false);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", "No se pudieron obtener los clientes", "error");
        setCargando(false);
      });
  };

  useEffect(() => {
    obtenerClientes();

    const socketUrl =
      import.meta.env.VITE_API_URL ||
      (import.meta.env.DEV ? "http://localhost:4040" : window.location.origin);
    const socket = io(socketUrl);

    socket.on("clientes-actualizados", () => {
      // Cargar clientes en segundo plano
      clienteAxios
        .get("/clientes")
        .then((respuesta) => {
          setClientes(respuesta.data);
        })
        .catch((err) => console.log(err));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const eliminarCliente = (id, nombre, apellido) => {
    Swal.fire({
      title: `¿Deseas eliminar a ${nombre} ${apellido}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "rgba(255, 255, 255, 0.08)",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios
          .delete(`/clientes/${id}`)
          .then((respuesta) => {
            Swal.fire("Eliminado", "El cliente ha sido eliminado", "success");
            setClienteSeleccionado(null);
            obtenerClientes();
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Error", "No se pudo eliminar al cliente", "error");
          });
      }
    });
  };

  const verDetalleCliente = (id) => {
    clienteAxios
      .get(`/clientes/${id}`)
      .then((respuesta) => {
        setClienteSeleccionado(respuesta.data);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire(
          "Error",
          "No se pudieron obtener los detalles del cliente",
          "error",
        );
      });
  };

  const filteredClientes = clientes.filter((cliente) => {
    if (busqueda === "") return true;
    const term = busqueda.toLowerCase();
    const nombreCompleto =
      `${cliente.nombre || ""} ${cliente.apellido || ""}`.toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      (cliente.telefono || "").toLowerCase().includes(term) ||
      (cliente.cedula || "").toLowerCase().includes(term)
    );
  });

  // Paginación sobre los resultados filtrados
  const totalPaginas = Math.ceil(filteredClientes.length / CLIENTES_POR_PAGINA);
  const indexInicio = (paginaActual - 1) * CLIENTES_POR_PAGINA;
  const clientesPaginados = filteredClientes.slice(
    indexInicio,
    indexInicio + CLIENTES_POR_PAGINA,
  );

  const cambiarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <Header active="clientes" />

      <div className="container py-3 mb-5">
        <div className="row g-4">
          {/* Panel Izquierdo: Listado de clientes */}
          <div className={clienteSeleccionado ? "col-12 col-lg-7" : "col-12"}>
            <div className="card card-glass p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="text-white mb-0">Clientes Frecuentes</h2>
                <Link to="/nuevo_cliente" className="btn btn-success">
                  <i className="bi bi-person-plus-fill"></i> Nuevo Cliente
                </Link>
              </div>

              {/* Buscador */}
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text border-0" id="iconSearch">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    className="form-control"
                    placeholder="Buscar cliente por nombre, teléfono, documento..."
                    value={busqueda}
                    onChange={cambiarBusqueda}
                    aria-describedby="iconSearch"
                  />
                </div>
                <div className="text-muted small mt-2">
                  {filteredClientes.length} cliente
                  {filteredClientes.length !== 1 ? "s" : ""} encontrado
                  {filteredClientes.length !== 1 ? "s" : ""}
                  {busqueda && ` para "${busqueda}"`}
                  {totalPaginas > 1 &&
                    ` — Página ${paginaActual} de ${totalPaginas}`}
                </div>
              </div>

              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : filteredClientes.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-people fs-1 mb-2 d-block"></i>
                  No se encontraron clientes.
                </div>
              ) : (
                <div className="table-glass-container d-none d-md-block">
                  <table className="table table-glass table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Teléfono</th>
                        <th>Cédula/DNI</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesPaginados.map((cliente) => (
                        <tr
                          key={cliente.id}
                          className={
                            clienteSeleccionado?.id === cliente.id
                              ? "bg-primary bg-opacity-10"
                              : ""
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => verDetalleCliente(cliente.id)}
                        >
                          <td className="fw-semibold text-white">
                            {cliente.nombre} {cliente.apellido}
                          </td>
                          <td>{cliente.telefono}</td>
                          <td>{cliente.cedula || "N/A"}</td>
                          <td
                            onClick={(e) => e.stopPropagation()}
                            className="text-center"
                          >
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                onClick={() => verDetalleCliente(cliente.id)}
                                className="btn btn-secondary btn-sm p-1 px-2"
                                title="Ver Ficha"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <Link
                                to={`/clientes/editar/${cliente.id}`}
                                className="btn btn-primary btn-sm p-1 px-2"
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                onClick={() =>
                                  eliminarCliente(
                                    cliente.id,
                                    cliente.nombre,
                                    cliente.apellido,
                                  )
                                }
                                className="btn btn-danger btn-sm p-1 px-2"
                                title="Eliminar"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Vista Móvil */}
              <div className="d-block d-md-none">
                {clientesPaginados.map((cliente) => (
                  <div
                    key={cliente.id}
                    className={`card card-glass p-3 mb-2 border ${clienteSeleccionado?.id === cliente.id ? "border-primary" : "border-secondary border-opacity-25"}`}
                    onClick={() => verDetalleCliente(cliente.id)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 className="h6 text-white mb-1 fw-bold">
                          {cliente.nombre} {cliente.apellido}
                        </h4>
                        <div className="text-muted small mb-1">
                          <i className="bi bi-telephone"></i> {cliente.telefono}
                        </div>
                        <div className="text-muted small">
                          <i className="bi bi-card-text"></i> Doc:{" "}
                          {cliente.cedula || "N/A"}
                        </div>
                      </div>
                      <div
                        className="d-flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to={`/clientes/editar/${cliente.id}`}
                          className="btn btn-primary btn-sm p-1 px-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() =>
                            eliminarCliente(
                              cliente.id,
                              cliente.nombre,
                              cliente.apellido,
                            )
                          }
                          className="btn btn-danger btn-sm p-1 px-2"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controles de Paginación */}
              {totalPaginas > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pt-3 border-top border-secondary border-opacity-20">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(1)}
                    title="Primera página"
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((prev) => prev - 1)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let start = Math.max(1, paginaActual - 2);
                    if (start + 4 > totalPaginas)
                      start = Math.max(1, totalPaginas - 4);
                    const page = start + i;
                    if (page > totalPaginas) return null;
                    return (
                      <button
                        key={page}
                        className={`btn btn-sm ${page === paginaActual ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setPaginaActual(page)}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual((prev) => prev + 1)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(totalPaginas)}
                    title="Última página"
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Historial de Servicios del Cliente Seleccionado */}
          {clienteSeleccionado && (
            <div className="col-12 col-lg-5 animate__animated animate__fadeInRight">
              <div
                className="card card-glass p-4 border border-primary border-opacity-20 position-sticky"
                style={{ top: "20px" }}
              >
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <span className="badge bg-primary bg-opacity-25 text-primary mb-2 px-2 py-1">
                      Ficha de Cliente
                    </span>
                    <h3 className="text-white mb-1">
                      {clienteSeleccionado.nombre}{" "}
                      {clienteSeleccionado.apellido}
                    </h3>
                    <p className="text-muted mb-0 small">
                      <i className="bi bi-telephone"></i>{" "}
                      {clienteSeleccionado.telefono} | DNI:{" "}
                      {clienteSeleccionado.cedula || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => setClienteSeleccionado(null)}
                    className="btn btn-secondary btn-sm p-1 px-2 border-0 bg-transparent text-white"
                  >
                    <i className="bi bi-x-lg fs-5"></i>
                  </button>
                </div>

                <h4 className="h6 text-primary border-bottom border-secondary border-opacity-25 pb-2 mb-3">
                  Historial de Servicios (
                  {clienteSeleccionado.servicios?.length || 0})
                </h4>

                <div
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                  className="pe-1"
                >
                  {!clienteSeleccionado.servicios ||
                  clienteSeleccionado.servicios.length === 0 ? (
                    <div className="text-muted text-center py-4 small">
                      No hay servicios registrados para este cliente.
                    </div>
                  ) : (
                    clienteSeleccionado.servicios.map((servicio) => (
                      <Link
                        key={servicio.id}
                        to={`/ingreso/${servicio.id}`}
                        className="card card-glass p-3 mb-2 border border-secondary border-opacity-25 text-decoration-none text-white hover-card d-block"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-bold text-primary small">
                              N° {servicio.numero_service}
                            </span>
                            <div className="fw-semibold text-white mt-1">
                              {servicio.marca} {servicio.modelo}
                            </div>
                            <div
                              className="text-muted small mt-1 text-truncate"
                              style={{ maxWidth: "240px" }}
                            >
                              Falla: {servicio.falla}
                            </div>
                          </div>
                          <div className="text-end">
                            <span
                              className={`badge-state px-2 py-1 small mb-1 d-inline-flex ${
                                servicio.estado === "Reparado"
                                  ? "state-reparado"
                                  : servicio.estado === "Sin arreglo"
                                    ? "state-sin-arreglo"
                                    : servicio.estado === "Avisado"
                                      ? "state-avisado"
                                      : servicio.estado === "Nuevo" ||
                                          servicio.estado === "Ingresado"
                                        ? "state-nuevo"
                                        : "state-entregado"
                              }`}
                            >
                              {servicio.estado}
                            </span>
                            <div className="text-muted small mt-1">
                              {servicio.fecha_ingreso}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-3 border-top border-secondary border-opacity-20 d-flex gap-2">
                  <Link
                    to={`/clientes/editar/${clienteSeleccionado.id}`}
                    className="btn btn-primary w-50 justify-content-center"
                  >
                    <i className="bi bi-pencil-fill"></i> Editar Cliente
                  </Link>
                  <button
                    onClick={() =>
                      eliminarCliente(
                        clienteSeleccionado.id,
                        clienteSeleccionado.nombre,
                        clienteSeleccionado.apellido,
                      )
                    }
                    className="btn btn-danger w-50 justify-content-center"
                  >
                    <i className="bi bi-trash-fill"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Clientes;
