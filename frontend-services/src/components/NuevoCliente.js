import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const NuevoCliente = () => {
    return (
        <Fragment>
            <div className="container-fluid d-flex bg-dark">
                <div className="row text-left text-white">
                    <h1 className="font-weight-bold mx-5">Services App</h1>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row text-center">
                    <div className="col-12">
                        <h1 className="display-5">Nuevo cliente</h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-9 mx-auto">
                        <Link to={'/nuevo'} className="btn btn-success text-uppercase"><i className="bi bi-arrow-left-circle"></i> Volver</Link>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col mx-auto">
                        <form>
                            
                        </form>

                    </div>
                </div>
            </div>

        </Fragment>

    );
}

export default NuevoCliente;