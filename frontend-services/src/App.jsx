import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';

import clienteAxios from './config/axios';

// Componentes
import Ingresos from './components/Ingresos';
import NuevoIngreso from './components/NuevoIngreso';
import Ingreso from "./components/Ingreso";
import EditarIngreso from './components/EditarIngreso';
import NuevoCliente from './components/NuevoCliente';
import Print from './components/Print';
import Clientes from './components/Clientes';
import EditarCliente from './components/EditarCliente';

function App() {

  const [ingresos, guardarIngresos] = useState([]);
  const [consultar, guardarConsultar] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4040" : window.location.origin);
    const socket = io(socketUrl);

    socket.on('ingresos-actualizados', () => {
      guardarConsultar(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setCargando(true);
    clienteAxios.get('/ingresos')
      .then(respuesta => {
        guardarIngresos(respuesta.data);
        guardarConsultar(false);
        setCargando(false);
      })
      .catch(error => {
        console.log(error);
        setCargando(false);
      });
  }, [consultar]);

  return (
    <Router>
      <Switch>
        <Route
        exact
        path="/"
        render={() => (
          <Ingresos 
            ingresos={ingresos} 
            cargando={cargando} 
            guardarConsultar={guardarConsultar} 
          />
        )}
        />
        <Route 
        exact
        path="/print"
        component={Print}
        />
        <Route 
        exact
        path="/nuevo"
        render={() => < NuevoIngreso guardarConsultar={guardarConsultar} />}
        />
        <Route 
        exact
        path="/nuevo_cliente"
        render={() => < NuevoCliente />}
        />
        <Route 
        exact
        path="/clientes"
        component={Clientes}
        />
        <Route 
        exact
        path="/clientes/editar/:id"
        component={EditarCliente}
        />
        <Route
        exact
        path="/ingreso/:id"
        component={Ingreso}
        />
        <Route
        exact
        path="/ingreso/editar/:id"
        component={EditarIngreso}
        />
      </Switch>
    </Router>
  );
}

export default App;
