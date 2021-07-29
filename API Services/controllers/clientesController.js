const Clientes = require('../models/Clientes');

// crear un nuevo clientes
exports.nuevoCliente = async (req, res, next) => {

    const cliente = new Cliente(req.body);

    try {
        await cliente.save();
        res.json({ mensaje: 'El cliente se agrego correctamente' });
    } catch (error) {
        console.log(error);
        next();
    }

}

// obtener todos los cliente 
exports.obtenerClientes = async (req, res, next) => {

    try {
        const clientes = await Cliente.find({});
        res.json(clientes);
    } catch (error) {
        console.log(error);
        next();
    }

}

// Obtener cliente por ID
exports.obtenerClienteID = async (req, res, next) => {

    try {
        const cliente = await Cliente.findById(req.params.id);
        res.json(cliente);
    } catch (error) {
        console.log(error);
        next();
    }

}

// actualizar cliente por ID
exports.actualizarCliente = async (req, res, next) => {

    try {
        const cliente = await Cliente.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true
        });
        res.json(cliente);
    } catch (error) {
        console.log(error);
        next();
    }

}

//Eliminar un cliente por ID
exports.eliminarCliente = async (req, res, next) => {

    try {
        await Cliente.findOneAndDelete({_id: req.params.id});
        res.json({ mensaje: 'El cliente fue eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }

}

