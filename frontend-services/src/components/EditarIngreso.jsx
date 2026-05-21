import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Header from "./Header";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";

const EditarIngreso = (props) => {
  const [ingreso, setIngreso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ingresoEditado, guardarIngresoEditado] = useState({
    nombre_c: "",
    apellido_c: "",
    telefono: "",
    marca: "",
    modelo: "",
    falla: "",
    precio: "0",
    seña: "0",
    cliente_id: null
  });

  const [clientes, setClientes] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [mostrarClientes, setMostrarClientes] = useState(false);

  useEffect(() => {
    const id = props.match.params.id;
    clienteAxios
      .get(`/ingresos/${id}`)
      .then((respuesta) => {
        setIngreso(respuesta.data);
        guardarIngresoEditado({
          nombre_c: respuesta.data.nombre_c || "",
          apellido_c: respuesta.data.apellido_c || "",
          telefono: respuesta.data.telefono || "",
          marca: respuesta.data.marca || "",
          modelo: respuesta.data.modelo || "",
          falla: respuesta.data.falla || "",
          precio: "" + (respuesta.data.precio || 0),
          seña: "" + (respuesta.data.seña || 0),
          cliente_id: respuesta.data.cliente_id || null
        });
        if (respuesta.data.cliente_id) {
          setBusquedaCliente(`${respuesta.data.nombre_c || ""} ${respuesta.data.apellido_c || ""}`.trim());
        }
        setCargando(false);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", "No se pudo cargar el ingreso", "error");
        props.history.push("/");
      });

    // Cargar clientes frecuentes
    clienteAxios.get('/clientes')
      .then(respuesta => {
        setClientes(respuesta.data);
      })
      .catch(error => {
        console.log("Error al cargar clientes", error);
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

  const { id, numero_service } = ingreso;
  const { nombre_c, apellido_c, telefono, marca, modelo, falla, precio, seña } = ingresoEditado;

  const actualizarState = (e) => {
    guardarIngresoEditado({
      ...ingresoEditado,
      [e.target.name]: e.target.value,
    });
  };

  const seleccionarCliente = (c) => {
    guardarIngresoEditado(prev => ({
      ...prev,
      nombre_c: c.nombre,
      apellido_c: c.apellido,
      telefono: c.telefono,
      cliente_id: c.id
    }));
    setBusquedaCliente(`${c.nombre} ${c.apellido}`);
    setMostrarClientes(false);
  };

  const desvincularCliente = () => {
    setBusquedaCliente("");
    guardarIngresoEditado(prev => ({
      ...prev,
      nombre_c: "",
      apellido_c: "",
      telefono: "",
      cliente_id: null
    }));
  };

  const clientesFiltrados = clientes.filter(c => {
    const text = `${c.nombre} ${c.apellido} ${c.telefono} ${c.cedula || ""}`.toLowerCase();
    return text.includes(busquedaCliente.toLowerCase());
  });

  const guardarCambios = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre_c.trim() || !apellido_c.trim() || !telefono.trim()) {
      Swal.fire("Campos requeridos", "Por favor completa Nombre, Apellido y Teléfono", "warning");
      return;
    }

    if (!marca.trim() || !modelo.trim() || !falla.trim()) {
      Swal.fire("Campos requeridos", "Por favor completa Marca, Modelo y Falla", "warning");
      return;
    }

    const p = parseFloat(precio);
    const s = parseFloat(seña);
    if (isNaN(p) || p < 0) {
      Swal.fire("Precio inválido", "El precio de reparación debe ser un número válido mayor o igual a 0", "error");
      return;
    }
    if (isNaN(s) || s < 0) {
      Swal.fire("Seña inválida", "La seña debe ser un número válido mayor o igual a 0", "error");
      return;
    }

    Swal.fire({
      title: `¿Deseas guardar los cambios?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "rgba(255, 255, 255, 0.08)",
      confirmButtonText: "Sí, guardar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios
          .put(`/ingresos/${id}`, ingresoEditado)
          .then((respuesta) => {
            Swal.fire("Datos actualizados!", "Los cambios se guardaron con éxito", "success");
            props.history.push(`/ingreso/${id}`);
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Error", "No se pudieron guardar los cambios", "error");
          });
      }
    });
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <Header
        rightElement={
          <Link to={`/ingreso/${id}`} className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> Cancelar
          </Link>
        }
      />

      <div className="container py-3 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card card-glass p-4 p-md-5">
              <h2 className="text-center text-white mb-2">Editar Service</h2>
              <p className="text-center text-muted small mb-4">Service Número: #{numero_service}</p>
              
              <form onSubmit={guardarCambios}>
                <div className="row g-4">
                  {/* Sección Datos del Cliente */}
                  <div className="col-12 col-md-6 border-end border-secondary border-opacity-25 pr-md-4">
                    <h3 className="h5 text-primary mb-4 d-flex align-items-center gap-2">
                      <i className="bi bi-person-fill"></i> Datos del Cliente
                    </h3>

                    {/* Buscador de Cliente Frecuente */}
                    <div className="mb-4 position-relative" style={{ zIndex: 100 }}>
                      <label className="form-label text-primary small fw-semibold">
                        <i className="bi bi-search"></i> Vincular / Buscar Cliente Frecuente
                      </label>
                      <div className="input-group">
                        <span className="input-group-text border-0"><i className="bi bi-people-fill"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Escribe nombre o teléfono..."
                          value={busquedaCliente}
                          onChange={(e) => {
                            setBusquedaCliente(e.target.value);
                            setMostrarClientes(true);
                          }}
                          onFocus={() => setMostrarClientes(true)}
                        />
                        {busquedaCliente && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary border-0"
                            onClick={desvincularCliente}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                      
                      {mostrarClientes && busquedaCliente.trim() && (
                        <div className="position-absolute w-100 bg-dark border border-secondary rounded mt-1 shadow-lg overflow-auto" style={{ maxHeight: '200px', zIndex: 1000 }}>
                          {clientesFiltrados.length === 0 ? (
                            <div className="p-2 text-muted small text-center">No se encontraron clientes</div>
                          ) : (
                            clientesFiltrados.map(c => (
                              <div
                                key={c.id}
                                className="p-2 border-bottom border-secondary border-opacity-25 hover-bg-glass text-white cursor-pointer"
                                onClick={() => seleccionarCliente(c)}
                              >
                                <div className="fw-semibold small">{c.nombre} {c.apellido}</div>
                                <div className="text-muted extra-small">Tel: {c.telefono} {c.cedula ? `| Doc: ${c.cedula}` : ""}</div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="nombre_c" className="form-label text-muted small fw-semibold">Nombre</label>
                      <div className="input-group">
                        <span className="input-group-text border-0"><i className="bi bi-person"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre_c"
                          name="nombre_c"
                          placeholder="Nombre"
                          value={nombre_c}
                          onChange={actualizarState}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="apellido_c" className="form-label text-muted small fw-semibold">Apellido</label>
                      <div className="input-group">
                        <span className="input-group-text border-0"><i className="bi bi-person"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          id="apellido_c"
                          name="apellido_c"
                          placeholder="Apellido"
                          value={apellido_c}
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
                          placeholder="Teléfono"
                          value={telefono}
                          onChange={actualizarState}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección Datos del Equipo */}
                  <div className="col-12 col-md-6 pl-md-4">
                    <h3 className="h5 text-primary mb-4 d-flex align-items-center gap-2">
                      <i className="bi bi-laptop-fill"></i> Datos del Equipo
                    </h3>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label htmlFor="marca" className="form-label text-muted small fw-semibold">Marca</label>
                        <input
                          type="text"
                          className="form-control"
                          id="marca"
                          name="marca"
                          placeholder="Marca"
                          value={marca}
                          onChange={actualizarState}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="modelo" className="form-label text-muted small fw-semibold">Modelo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="modelo"
                          name="modelo"
                          placeholder="Modelo"
                          value={modelo}
                          onChange={actualizarState}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="falla" className="form-label text-muted small fw-semibold">Falla Reportada</label>
                      <textarea
                        className="form-control"
                        id="falla"
                        name="falla"
                        rows="3"
                        placeholder="Falla"
                        value={falla}
                        onChange={actualizarState}
                      ></textarea>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label htmlFor="precio" className="form-label text-muted small fw-semibold">Precio de Reparación</label>
                        <div className="input-group">
                          <span className="input-group-text border-0"><i className="bi bi-currency-dollar"></i></span>
                          <input
                            type="number"
                            className="form-control"
                            id="precio"
                            name="precio"
                            min="0"
                            placeholder="Precio"
                            value={precio}
                            onChange={actualizarState}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="seña" className="form-label text-muted small fw-semibold">Seña</label>
                        <div className="input-group">
                          <span className="input-group-text border-0"><i className="bi bi-cash"></i></span>
                          <input
                            type="number"
                            className="form-control"
                            id="seña"
                            name="seña"
                            min="0"
                            placeholder="Seña"
                            value={seña}
                            onChange={actualizarState}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-top border-secondary border-opacity-20 pt-4">
                  <button type="submit" className="btn btn-primary btn-lg w-100 justify-content-center p-3 text-uppercase">
                    <i className="bi bi-save-fill"></i> Guardar Cambios
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

export default withRouter(EditarIngreso);
