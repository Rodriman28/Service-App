import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Ingresos = ({ ingresos }) => {
  const [busqueda, guardarBusqueda] = useState("");

  if (ingresos.length === 0) return null;

  const colorEstado = (estado) => {
    let color;

    switch (estado) {
      case "Entregado-Reparado":
        color = "text-secondary";
      case "Entregado-Sin Arreglo":
        color = "text-secondary";
      case "Sin arreglo":
        color = "text-danger";
      case "Reparado":
        color = "text-success";
      case "Avisado":
        color = "text-info";
      default:
        color = "text-warning";
    }
    return color;
  };

  return (
    <Fragment>
      <div className="container-fluid d-flex bg-dark">
        <div className="row text-left text-white">
          <h1 className="font-weight-bold mx-5">Services App</h1>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mt-5 mb-5 d-flex justify-content-center">
          <div className="col-5">
            <div className="input-group w-50">
              <span className="input-group-text" id="iconSearch">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control"
                name="termino"
                placeholder="Buscar"
                onChange={(e) => {
                  guardarBusqueda(e.target.value);
                }}
                aria-describedby="iconSearch"
              ></input>
            </div>
          </div>
          <div className="col-5 d-flex justify-content-end">
            <Link to={"/nuevo"} className="btn btn-success">
              Nuevo Service <i className="bi bi-plus-circle"></i>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-10 mx-auto">
            <table className="table table2 table-hover">
              <thead>
                <tr>
                  <th className="table-dark" scope="col">
                    #
                  </th>
                  <th className="table-dark" scope="col">
                    Nombre y Apellido
                  </th>
                  <th className="table-dark" scope="col">
                    Telefono
                  </th>
                  <th className="table-dark" scope="col">
                    Marca
                  </th>
                  <th className="table-dark" scope="col">
                    Modelo
                  </th>
                  <th className="table-dark" scope="col">
                    Falla
                  </th>
                  <th className="table-dark" scope="col">
                    Precio
                  </th>
                  <th className="table-dark" scope="col">
                    Seña
                  </th>
                  <th className="table-dark" scope="col">
                    Fecha
                  </th>
                  <th className="table-dark" scope="col">
                    Estado
                  </th>
                  <th className="table-dark" scope="col">
                    Ver
                  </th>
                </tr>
              </thead>
              <tbody>
                {ingresos
                  .filter((ingreso) => {
                    const num = "" + ingreso.numero_service;
                    if (busqueda === "") {
                      return ingreso;
                    } else if (
                      ingreso.nombre_c
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      ingreso.apellido_c
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      ingreso.telefono
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      num.toLowerCase().includes(busqueda.toLowerCase()) ||
                      ingreso.marca
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      ingreso.modelo
                        .toLowerCase()
                        .includes(busqueda.toLowerCase()) ||
                      ingreso.fecha_ingreso
                        .toLowerCase()
                        .includes(busqueda.toLowerCase())
                    ) {
                      console.log(num);
                      return ingreso;
                    }
                  })
                  .map((ingreso) => (
                    <tr key={ingreso._id}>
                      <th scope="row">{ingreso.numero_service}</th>
                      <td>
                        {" "}
                        {ingreso.nombre_c} {ingreso.apellido_c}{" "}
                      </td>
                      <td>{ingreso.telefono}</td>
                      <td>{ingreso.marca}</td>
                      <td>{ingreso.modelo}</td>
                      <td>{ingreso.falla}</td>
                      <td>{ingreso.precio}</td>
                      <td>{ingreso.seña}</td>
                      <td>{ingreso.fecha_ingreso}</td>
                      <td>
                        <span
                          className={`fw-bold ${colorEstado(ingreso.estado)}`}
                        >
                          {ingreso.estado}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/ingreso/${ingreso._id}`}
                          className="btn btn-primary"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                  .reverse()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Ingresos;
