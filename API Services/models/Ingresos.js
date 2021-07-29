const mongoose = require('mongoose');
const sequence = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const ingresosSchema = new Schema({
    numero_service: {
        type: Number,
        trim: true,
    },
    nombre_c: {
        type: String,
        trim: true,
    },
    apellido_c: {
        type: String,
        trim: true,
    },
    telefono: {
        type: String,
        trim: true,
    },
    fecha_ingreso: {
        type: String,
        trim: true,
    },
    hora_ingreso: {
        type: String,
        trim: true,
    },
    marca: {
        type: String,
        trim: true,
    },
    modelo: {
        type: String,
        trim: true,
    },
    falla: {
        type: String,
        trim: true,
    },
    precio: {
        type: String,
        trim: true,
    },
    seña: {
        type: String,
        trim: true,
    },
    estado: {
        type: String,
        trim: true,
    }
});

ingresosSchema.plugin(sequence, {inc_field: 'numero_service'});

module.exports = mongoose.model('Ingresos', ingresosSchema)