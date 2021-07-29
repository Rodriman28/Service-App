const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientesSchema = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    cedula: {
        type: String,
        trim: true
    },
    services: {
        id: {
            type: String,
            trim: true,
        },
        num_service: {
            type: String,
            trim: true
        },
    },
});

module.exports = mongoose.model('Clientes', clientesSchema)