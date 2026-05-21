const Ingreso = require('../models/Ingresos');

exports.contarIngresos = async (req, res, next) => {
  try {
    const total = await Ingreso.count();
    res.json({ total });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.nuevoIngreso = async (req, res, next) => {
  try {
    const ingreso = await Ingreso.create(req.body);
    if (req.io) {
      req.io.emit('ingresos-actualizados');
    }
    res.json({ mensaje: 'El ingreso se agrego correctamente', id: ingreso.id });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.obtenerIngresos = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const ingresos = await Ingreso.findAll(limit, offset);
    res.json(ingresos);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.obtenerIngresoID = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const ingreso = await Ingreso.findByPk(id);
    if (!ingreso) {
      return res.status(404).json({ mensaje: 'Ingreso no encontrado' });
    }
    res.json(ingreso);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.actualizarIngreso = async (req, res, next) => {
  try {
    const ingreso = await Ingreso.update(req.body, req.params.id);
    if (req.io) {
      req.io.emit('ingresos-actualizados');
    }
    res.json(ingreso);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.eliminarIngreso = async (req, res, next) => {
  try {
    await Ingreso.destroy(req.params.id);
    if (req.io) {
      req.io.emit('ingresos-actualizados');
    }
    res.json({ mensaje: 'El ingreso fue eliminado' });
  } catch (error) {
    console.log(error);
    next();
  }
};