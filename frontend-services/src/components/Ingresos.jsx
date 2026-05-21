import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Ingresos = ({ ingresos, cargando, guardarConsultar }) => {
  const [busqueda, guardarBusqueda] = useState("");
  const [ocultarEntregados, setOcultarEntregados] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 50;

  useEffect(() => {
    guardarConsultar(true);
  }, [guardarConsultar]);

  if (cargando) {
    return (
      <Fragment>
      <Header active="services" />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary fs-4"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-3 fw-semibold">Cargando servicios...</p>
          </div>
        </div>
      </Fragment>
    );
  }

  if (ingresos.length === 0) {
    return (
      <Fragment>
        <Header active="services" />
        <div className="container py-5 text-center text-muted">
          <i className="bi bi-tools fs-1 mb-3 d-block"></i>
          <h3 className="text-white mb-3">No hay servicios registrados</h3>
          <Link to={"/nuevo"} className="btn btn-success mt-2">
            <i className="bi bi-plus-circle-fill"></i> Crear Primer Service
          </Link>
        </div>
      </Fragment>
    );
  }

  // Filtrar ingresos según término de búsqueda y estado oculto
  const filteredIngresos = ingresos.filter((ingreso) => {
    // Si la opción de ocultar está activa y el estado es entregado, lo filtramos fuera
    if (
      ocultarEntregados &&
      (ingreso.estado === "Entregado-Reparado" ||
        ingreso.estado === "Entregado-Sin Arreglo")
    ) {
      return false;
    }

    const num = "" + ingreso.numero_service;
    if (busqueda === "") {
      return true;
    }
    const term = busqueda.toLowerCase();
    return (
      (ingreso.nombre_c || "").toLowerCase().includes(term) ||
      (ingreso.apellido_c || "").toLowerCase().includes(term) ||
      (ingreso.telefono || "").toLowerCase().includes(term) ||
      num.toLowerCase().includes(term) ||
      (ingreso.marca || "").toLowerCase().includes(term) ||
      (ingreso.modelo || "").toLowerCase().includes(term) ||
      (ingreso.fecha_ingreso || "").toLowerCase().includes(term)
    );
  });

  // Paginación del lado del cliente
  const totalPaginas = Math.ceil(filteredIngresos.length / ITEMS_POR_PAGINA);
  const indexInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const ingresosPaginados = filteredIngresos.slice(
    indexInicio,
    indexInicio + ITEMS_POR_PAGINA,
  );

  const cambiarBusqueda = (e) => {
    guardarBusqueda(e.target.value);
    setPaginaActual(1);
  };

  // Métricas rápidas
  const nuevos = ingresos.filter(
    (i) =>
      i.estado === "Nuevo" ||
      i.estado === "Ingresado" ||
      !i.estado ||
      i.estado === "",
  ).length;
  const reparados = ingresos.filter((i) => i.estado === "Reparado").length;
  const avisados = ingresos.filter((i) => i.estado === "Avisado").length;

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
      <Header active="services" />

      <div className="container-fluid px-md-5">
        {/* Panel de Métricas (KPIs) */}
        <div className="row g-3 mb-5">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card card-glass kpi-card">
              <div>
                <span className="text-muted small text-uppercase fw-bold">
                  Pendientes
                </span>
                <div className="kpi-val text-primary">{nuevos}</div>
              </div>
              <div className="kpi-icon bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-clock-history"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card card-glass kpi-card">
              <div>
                <span className="text-muted small text-uppercase fw-bold">
                  Reparados (Listos)
                </span>
                <div className="kpi-val text-success">{reparados}</div>
              </div>
              <div className="kpi-icon bg-success bg-opacity-10 text-success">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card card-glass kpi-card">
              <div>
                <span className="text-muted small text-uppercase fw-bold">
                  Avisados
                </span>
                <div className="kpi-val text-info">{avisados}</div>
              </div>
              <div className="kpi-icon bg-info bg-opacity-10 text-info">
                <i className="bi bi-megaphone"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card card-glass kpi-card">
              <div>
                <span className="text-muted small text-uppercase fw-bold">
                  Total Cargados
                </span>
                <div className="kpi-val text-white">{ingresos.length}</div>
              </div>
              <div className="kpi-icon bg-secondary bg-opacity-10 text-white">
                <i className="bi bi-layers"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador y Botón Nuevo */}
        <div className="row mb-4 align-items-center g-3">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text border-0" id="iconSearch">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control"
                name="termino"
                placeholder="Buscar por cliente, teléfono, service..."
                value={busqueda}
                onChange={cambiarBusqueda}
                aria-describedby="iconSearch"
              />
            </div>
            <div className="text-muted small mt-2 ms-1">
              {filteredIngresos.length} servicio
              {filteredIngresos.length !== 1 ? "s" : ""} encontrado
              {filteredIngresos.length !== 1 ? "s" : ""}
              {busqueda && ` para "${busqueda}"`}
              {totalPaginas > 1 &&
                ` — Página ${paginaActual} de ${totalPaginas}`}
            </div>
          </div>
          <div className="col-12 col-md-3 d-flex align-items-center">
            <div className="form-check form-switch ms-md-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={ocultarEntregados}
                onChange={(e) => {
                  setOcultarEntregados(e.target.checked);
                  setPaginaActual(1);
                }}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label text-muted small fw-semibold ms-2"
                htmlFor="flexSwitchCheckDefault"
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Ocultar Entregados
              </label>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-md-end">
            <Link to={"/nuevo"} className="btn btn-success">
              <i className="bi bi-plus-circle-fill"></i> Nuevo Service
            </Link>
          </div>
        </div>

        {/* Vista para Escritorio (Tabla) */}
        <div className="d-none d-md-block mb-4">
          <div className="table-glass-container">
            <table className="table table-glass table-hover">
              <thead>
                <tr>
                  <th scope="col"># Service</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Teléfono</th>
                  <th scope="col">Equipo</th>
                  <th scope="col">Falla</th>
                  <th scope="col">Precio / Seña</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ingresosPaginados.map((ingreso) => (
                  <tr key={ingreso.id}>
                    <td className="fw-bold text-white">
                      #{ingreso.numero_service}
                    </td>
                    <td>
                      <div className="fw-bold text-white">
                        {ingreso.nombre_c} {ingreso.apellido_c}
                      </div>
                    </td>
                    <td className="text-muted">{ingreso.telefono}</td>
                    <td>
                      <div className="text-white">{ingreso.marca}</div>
                      <div className="small text-muted">{ingreso.modelo}</div>
                    </td>
                    <td
                      className="text-muted text-truncate"
                      style={{ maxWidth: "150px" }}
                    >
                      {ingreso.falla}
                    </td>
                    <td>
                      <div className="fw-bold text-success">
                        ${ingreso.precio}
                      </div>
                      {parseInt(ingreso.seña || 0) > 0 && (
                        <div className="small text-muted">
                          Seña: ${ingreso.seña}
                        </div>
                      )}
                    </td>
                    <td className="small text-muted">
                      {ingreso.fecha_ingreso}
                    </td>
                    <td>
                      <span
                        className={`badge-state ${getBadgeClass(ingreso.estado)}`}
                      >
                        {ingreso.estado || "Nuevo"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/ingreso/${ingreso.id}`}
                        className="btn btn-primary btn-sm px-3"
                      >
                        <i className="bi bi-eye-fill"></i> Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vista para Móviles (Cards List) */}
        <div className="d-md-none mb-4">
          {ingresosPaginados.map((ingreso) => (
            <div key={ingreso.id} className="card card-glass mb-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-white fs-5">
                  #{ingreso.numero_service}
                </span>
                <span
                  className={`badge-state ${getBadgeClass(ingreso.estado)}`}
                >
                  {ingreso.estado || "Nuevo"}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Cliente:</span>
                <span className="mobile-card-value text-white">
                  {ingreso.nombre_c} {ingreso.apellido_c}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Teléfono:</span>
                <span className="mobile-card-value text-muted">
                  {ingreso.telefono}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Equipo:</span>
                <span className="mobile-card-value text-white">
                  {ingreso.marca} {ingreso.modelo}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Falla:</span>
                <span
                  className="mobile-card-value text-muted text-truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {ingreso.falla}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Precio/Seña:</span>
                <span className="mobile-card-value text-success fw-bold">
                  ${ingreso.precio}{" "}
                  {parseInt(ingreso.seña || 0) > 0 &&
                    `(Seña: $${ingreso.seña})`}
                </span>
              </div>
              <div className="mobile-card-row mb-3">
                <span className="mobile-card-label">Fecha:</span>
                <span className="mobile-card-value text-muted small">
                  {ingreso.fecha_ingreso}
                </span>
              </div>
              <Link
                to={`/ingreso/${ingreso.id}`}
                className="btn btn-primary w-100 justify-content-center"
              >
                <i className="bi bi-eye-fill"></i> Ver Detalles
              </Link>
            </div>
          ))}
        </div>

        {/* Paginación */}
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
        <div className="text-center text-muted mt-3 mb-4 small">
          Mostrando del {filteredIngresos.length === 0 ? 0 : indexInicio + 1} al{" "}
          {Math.min(indexInicio + ITEMS_POR_PAGINA, filteredIngresos.length)} de{" "}
          {filteredIngresos.length} servicios
        </div>
      </div>
    </Fragment>
  );
};

export default Ingresos;
