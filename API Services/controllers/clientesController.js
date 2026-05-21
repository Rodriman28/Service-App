const Clientes = require('../models/Clientes');

exports.nuevoCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.create(req.body);
    if (req.io) {
      req.io.emit('clientes-actualizados');
    }
    res.json({ mensaje: 'El cliente se agrego correctamente', id: cliente.id });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.findAll();
    res.json(clientes);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.obtenerClienteID = async (req, res, next) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Obtener servicios asociados a este cliente
    const { getDb } = require('../config/database');
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM ingresos WHERE cliente_id = ? ORDER BY id DESC');
    stmt.bind([parseInt(req.params.id)]);
    const servicios = [];
    while (stmt.step()) {
      servicios.push(stmt.getAsObject());
    }
    stmt.free();

    res.json({
      ...cliente,
      servicios
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.update(req.body, req.params.id);
    if (req.io) {
      req.io.emit('clientes-actualizados');
      req.io.emit('ingresos-actualizados'); // Por si cambia nombre/telefono que afecte a servicios vinculados
    }
    res.json(cliente);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.eliminarCliente = async (req, res, next) => {
  try {
    await Clientes.destroy(req.params.id);
    if (req.io) {
      req.io.emit('clientes-actualizados');
    }
    res.json({ mensaje: 'El cliente fue eliminado' });
  } catch (error) {
    console.log(error);
    next();
  }
};