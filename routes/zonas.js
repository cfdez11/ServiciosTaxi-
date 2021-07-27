//Rutas para crear zonas
const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator')
//Crea un usuario
//api/zona

//Primer middleware: Añade una nueva zona
router.post('/', 
    [
        check('nombre', 'El nombre de la zona es obligatorio').not().isEmpty(),
        check('precio', 'El precio des obligatorio').not().isEmpty()
    ],
    auth,
    zonaController.crearZona
);

//Obtiene las zonas 
router.get('/',
    auth,
    zonaController.obtenerZonas
);

//Obtiene las zonas 
router.delete('/:id',
    auth,
    zonaController.eliminarZona
);
module.exports = router;