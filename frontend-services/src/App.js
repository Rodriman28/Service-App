import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import clienteAxios from './config/axios';

// Componentes
import Ingresos from './components/Ingresos';
import NuevoIngreso from './components/NuevoIngreso';
import Ingreso from "./components/Ingreso";
import EditarIngreso from './components/EditarIngreso';
import NuevoCliente from './components/NuevoCliente';
import Print from './components/Print';

function App() {

  // state de la app
  const [ingresos, guardarIngresos] = useState([]);
  const [consultar, guardarConsultar] = useState(true);

  useEffect( ()=> {
    const consultarAPI = () => {
      clienteAxios.get('/ingresos')
      .then(respuesta => {
      
        guardarIngresos(respuesta.data);

        guardarConsultar(false);

      })
      .catch(error => {
        console.log(error);
      })
    }
    consultarAPI();
  }, [consultar]);

  return (
    
    <Router>
      <Switch>
        <Route 
        exact
        path="/"
        component={() => <Ingresos ingresos={ingresos} />}
        />
        <Route 
        exact
        path="/print"
        component={Print}
        />
        <Route 
        exact
        path="/nuevo"
        component={() => < NuevoIngreso guardarConsultar={guardarConsultar} />}
        />
        <Route 
        exact
        path="/nuevo_cliente"
        component={() => < NuevoCliente />}
        />
        <Route 
        exact
        path="/ingreso/:id"
        render={(props) => {
          const ingreso = ingresos.filter(ingreso => ingreso._id === props.match.params.id)
          
          return (
            <Ingreso
              ingreso={ingreso[0]}
              
              guardarConsultar={guardarConsultar}
            />
          )
        }}
        />
        <Route 
        exact
        path="/ingreso/editar/:id"
        render={(props) => {
          const ingreso = ingresos.filter(ingreso => ingreso._id === props.match.params.id)
          return (
            <EditarIngreso
              ingreso={ingreso[0]}
              guardarConsultar={guardarConsultar}
            />
          )
        }}
        />
      </Switch>
    </Router>



  );
}

export default App;
