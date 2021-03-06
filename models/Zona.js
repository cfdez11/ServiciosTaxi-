const mongoose = require('mongoose');

const ZonasSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    precio: {
        type: Number,
        require: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

module.exports = mongoose.model('Zona', ZonasSchema);