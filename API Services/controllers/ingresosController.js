const Ingreso = require('../models/Ingresos');

// crear un nuevo ingreso
exports.nuevoIngreso = async (req, res, next) => {

    const ingreso = new Ingreso(req.body);

    try {
        await ingreso.save();
        res.json({ mensaje: 'El ingreso se agrego correctamente' });
    } catch (error) {
        console.log(error);
        next();
    }

}

// obtener todos los ingresos 
exports.obtenerIngresos = async (req, res, next) => {

    try {
        const ingresos = await Ingreso.find({});
        res.json(ingresos);
    } catch (error) {
        console.log(error);
        next();
    }

}

// Obtener ingreso por ID
exports.obtenerIngresoID = async (req, res, next) => {

    try {
        const ingreso = await Ingreso.findById(req.params.id);
        res.json(ingreso);
    } catch (error) {
        console.log(error);
        next();
    }

}

// actualizar ingreso por ID
exports.actualizarIngreso = async (req, res, next) => {

    try {
        const ingreso = await Ingreso.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true
        });
        res.json(ingreso);
    } catch (error) {
        console.log(error);
        next();
    }

}

//Eliminar un ingreso por ID
exports.eliminarIngreso = async (req, res, next) => {

    try {
        await Ingreso.findOneAndDelete({_id: req.params.id});
        res.json({ mensaje: 'El ingreso fue eliminado' });
    } catch (error) {
        console.log(error);
        next();
    }

}

