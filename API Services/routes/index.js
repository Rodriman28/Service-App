const express = require('express');
const router = express.Router();
const ingresosController = require('../controllers/ingresosController');
const clientesController = require('../controllers/clientesController');

module.exports = function() {

 // INGRESOS ----------------------------------------------------------------------------------

    // Agrega nuevos ingresos via POST
    router.post('/ingresos',
        ingresosController.nuevoIngreso
    )

    // Obtiene todos los registros de la BD
    router.get('/ingresos', 
        ingresosController.obtenerIngresos
    )
    
    // Obtiene un ingreso en especifico por ID
    router.get('/ingresos/:id',
        ingresosController.obtenerIngresoID
    )
    
    // Actualizar un registro por ID
    router.put('/ingresos/:id',
        ingresosController.actualizarIngreso
    )

    // Eliminar un registro por ID
    router.delete('/ingresos/:id',
        ingresosController.eliminarIngreso
    )

// CLIENTES ----------------------------------------------------------------------------------

    // Agrega nuevos clientes via POST
    router.post('/clientes',
        clientesController.nuevoCliente
    )

    // Obtiene todos los clientes
    router.get('/clientes',
        clientesController.obtenerClientes
    )

    // Obtiene un cliente por ID
    router.get('/clientes/:id',
        clientesController.obtenerClienteID
    )

    // Agrega nuevos clientes via POST
    router.put('/clientes/:id',
        clientesController.actualizarCliente
    )

    // Agrega nuevos clientes via POST
    router.delete('/clientes/:id',
        clientesController.eliminarCliente
    )

    return router
}