const mongoose = require('mongoose');

const ServicioShcema = mongoose.Schema({
    idservicio:{
        type: Number,
        required: true,
        trim: true
    },
    salida:{
        type: String,
        required: true,
        trim: true
    },
    cliente:{
        type: String,
        required: true,
        trim: true
    },
    ttoo:{
        type: String,
        required: true,
        trim: true
    },
    letreros:{
        type: String,
        trim: true
    },
    conductor:{
        type: String,
        required: true,
        trim: true
    },
    vehiculo:{
        type: String,
        required: true,
        trim: true
    },
    refvuelo:{
        type: String,
        required: true,
        trim: true
    },
    horavuelo:{
        type: String,
        trim: true
    },
    llegada:{
        type: String,
        required: true,
        trim: true
    },
    zona:{
        type: String,
        required: true,
        trim: true
    },
    adultos:{
        type: Number,
        required: true,
    },
    ninos:{
        type: Number,
        required: true,
    },
    pasageros:{
        type: Number,
        required: true,
    },
    precio:{
        type: Number,
        required: true,
    },
    observaciones:{
        type: String,
        trim: true
    },
    tipo:{
        type: String,
        required: true,
        trim: true
    },
    fecha:{
        type: Date,
        required: true
    },
    horainicio:{
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    compartido: {
        type: Array,
        of: mongoose.Schema.Types.Mixed
    },
    doc: {
        type: mongoose.Schema.Types.Mixed
    }
});

module.exports = mongoose.model('Servicio', ServicioShcema);