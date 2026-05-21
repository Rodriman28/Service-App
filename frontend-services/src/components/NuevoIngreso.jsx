import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { generarPDFService } from "../utils/pdfGenerator";
import clienteAxios from "../config/axios";

const NuevoIngreso = (props) => {
  const date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  const fecha = year + "-" + month + "-" + date;
  const hora = hours + ":" + minutes;

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
    precio: "0",
    seña: "0",
    estado: "Nuevo",
    cliente_id: null
  });

  // Estado para la búsqueda de clientes frecuentes
  const [clientes, setClientes] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [mostrarClientes, setMostrarClientes] = useState(false);

  useEffect(() => {
    // Obtener los clientes para la búsqueda
    clienteAxios.get('/clientes')
      .then(respuesta => {
        setClientes(respuesta.data);
      })
      .catch(error => {
        console.log("Error al cargar clientes", error);
      });
  }, []);

  const actualizarState = (e) => {
    guardarIngreso({
      ...ingreso,
      [e.target.name]: e.target.value,
    });
  };

  const seleccionarCliente = (c) => {
    guardarIngreso(prev => ({
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
    guardarIngreso(prev => ({
      ...prev,
      nombre_c: "",
      apellido_c: "",
      telefono: "",
      cliente_id: null
    }));
  };

  // Filtrado de clientes según el texto ingresado
  const clientesFiltrados = clientes.filter(c => {
    const text = `${c.nombre} ${c.apellido} ${c.telefono} ${c.cedula || ""}`.toLowerCase();
    return text.includes(busquedaCliente.toLowerCase());
  });

  const imprimir = () => {
    clienteAxios.get('/ingresos')
      .then(respuesta => {
        const todosIngresos = respuesta.data;
        const ingresoReverso = todosIngresos.reverse();
        const ultimoIngreso = ingresoReverso[0];
        generarPDFService(ultimoIngreso);
      })
      .catch(error => console.log(error));
  };

  const crearNuevoIngreso = (e) => {
    e.preventDefault();

    // Validaciones
    if (!ingreso.nombre_c.trim() || !ingreso.apellido_c.trim() || !ingreso.telefono.trim()) {
      Swal.fire("Campos requeridos", "Por favor completa Nombre, Apellido y Teléfono del cliente", "warning");
      return;
    }

    if (!ingreso.marca.trim() || !ingreso.modelo.trim() || !ingreso.falla.trim()) {
      Swal.fire("Campos requeridos", "Por favor completa Marca, Modelo y Falla del equipo", "warning");
      return;
    }

    const p = parseFloat(ingreso.precio);
    const s = parseFloat(ingreso.seña);
    if (isNaN(p) || p < 0) {
      Swal.fire("Precio inválido", "El precio de reparación debe ser un número válido mayor o igual a 0", "error");
      return;
    }
    if (isNaN(s) || s < 0) {
      Swal.fire("Seña inválida", "La seña debe ser un número válido mayor o igual a 0", "error");
      return;
    }

    Swal.fire({
      title: '¿Desea imprimir el comprobante de service?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: 'rgba(255, 255, 255, 0.08)',
      confirmButtonText: 'Sí, imprimir',
      cancelButtonText: 'No, solo guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        clienteAxios.post("/ingresos", ingreso)
          .then((respuesta) => {
            props.guardarConsultar(true);
            imprimir();
            Swal.fire('¡Guardado!', 'El service ha sido creado correctamente.', 'success');
            props.history.push(`/`);
          })
          .catch(err => {
            console.log(err);
            Swal.fire('Error', 'No se pudo crear el service', 'error');
          });
      } else {
        clienteAxios.post("/ingresos", ingreso)
          .then((respuesta) => {
            props.guardarConsultar(true);
            Swal.fire('¡Guardado!', 'El service ha sido creado correctamente.', 'success');
            props.history.push(`/`);
          })
          .catch(err => {
            console.log(err);
            Swal.fire('Error', 'No se pudo crear el service', 'error');
          });
      }
    });
  };

  return (
    <Fragment>
      {/* Encabezado */}
      <header className="app-header py-3 mb-4">
        <div className="container-fluid d-flex justify-content-between align-items-center px-md-5">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cpu text-primary fs-3"></i>
            <h1 className="h3 mb-0 font-weight-bold text-white">Zero Informática</h1>
          </div>
          <Link to={"/"} className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> Cancelar
          </Link>
        </div>
      </header>

      <div className="container py-3 mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card card-glass p-4 p-md-5">
              <h2 className="text-center text-white mb-4">Nuevo Registro de Service</h2>
              
              <form onSubmit={crearNuevoIngreso}>
                <div className="row g-4">
                  {/* Sección Datos del Cliente */}
                  <div className="col-12 col-md-6 border-end border-secondary border-opacity-25 pr-md-4">
                    <h3 className="h5 text-primary mb-4 d-flex align-items-center gap-2">
                      <i className="bi bi-person-fill"></i> Datos del Cliente
                    </h3>
                    
                    {/* Buscador de Cliente Frecuente */}
                    <div className="mb-4 position-relative" style={{ zIndex: 100 }}>
                      <label className="form-label text-primary small fw-semibold">
                        <i className="bi bi-search"></i> Buscar Cliente Frecuente
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
                          placeholder="Nombre del cliente"
                          value={ingreso.nombre_c}
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
                          placeholder="Apellido del cliente"
                          value={ingreso.apellido_c}
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
                          placeholder="Número de contacto"
                          value={ingreso.telefono}
                          onChange={actualizarState}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link to={"/nuevo_cliente"} className="btn btn-secondary w-100 justify-content-center">
                        <i className="bi bi-person-plus-fill"></i> Registrar Cliente Nuevo
                      </Link>
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
                          placeholder="Ej: ASUS, HP..."
                          value={ingreso.marca}
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
                          placeholder="Ej: Zenbook, Pavilion..."
                          value={ingreso.modelo}
                          onChange={actualizarState}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="falla" className="form-label text-muted small fw-semibold">Falla Reportada / Síntomas</label>
                      <textarea
                        className="form-control"
                        id="falla"
                        name="falla"
                        rows="3"
                        placeholder="Descripción detallada de la falla..."
                        value={ingreso.falla}
                        onChange={actualizarState}
                      ></textarea>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label htmlFor="precio" className="form-label text-muted small fw-semibold">Precio Presupuestado</label>
                        <div className="input-group">
                          <span className="input-group-text border-0"><i className="bi bi-currency-dollar"></i></span>
                          <input
                            type="number"
                            className="form-control"
                            id="precio"
                            name="precio"
                            min="0"
                            placeholder="0"
                            value={ingreso.precio}
                            onChange={actualizarState}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="seña" className="form-label text-muted small fw-semibold">Seña Recibida</label>
                        <div className="input-group">
                          <span className="input-group-text border-0"><i className="bi bi-cash"></i></span>
                          <input
                            type="number"
                            className="form-control"
                            id="seña"
                            name="seña"
                            min="0"
                            placeholder="0"
                            value={ingreso.seña}
                            onChange={actualizarState}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-top border-secondary border-opacity-20 pt-4">
                  <button type="submit" className="btn btn-success btn-lg w-100 justify-content-center p-3 text-uppercase">
                    <i className="bi bi-check-circle-fill fs-5"></i> Registrar e Ingresar Equipo
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

export default withRouter(NuevoIngreso);
