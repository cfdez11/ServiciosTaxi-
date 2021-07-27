const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea servicios
//api/servicios
//Agrega un servicio
router.post('/',
    auth,
    [
        check('idservicio', 'El No. servicio del servicio es obligatorio').not().isEmpty(),
        check('salida', 'La salida del servicio es obligatorio').not().isEmpty(),
        check('cliente', 'El cliente del servicio es obligatorio').not().isEmpty(),
        check('ttoo', 'El ttoo del servicio es obligatorio').not().isEmpty(),
        check('conductor', 'El conductor del servicio es obligatorio').not().isEmpty(),
        check('vehiculo', 'El vehiculo del servicio es obligatorio').not().isEmpty(),
        check('refvuelo', 'La refvuelo del servicio es obligatorio').not().isEmpty(),
        check('llegada', 'La llegada del servicio es obligatorio').not().isEmpty(),
        check('zona', 'El zona del servicio es obligatorio').not().isEmpty(),
        check('adultos', 'Los adultos del servicio es obligatorio').not().isEmpty(),
        check('ninos', 'Los niños del servicio es obligatorio').not().isEmpty(),
        check('pasageros', 'Los pasageros del servicio es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo del servicio es obligatorio').not().isEmpty(),
        check('fecha', 'La fecha del servicio es obligatorio').not().isEmpty(),
        check('horainicio', 'La horainicio del servicio es obligatorio').not().isEmpty(),
        check('precio', 'El precio del servicio es obligatorio').not().isEmpty()

    ],
    servicioController.crearServicio
);

//Obtiene los servicios del usuario
router.get('/id',
    auth,
    servicioController.obtenerServicioID
);
router.get('/dia',
    auth,
    servicioController.obtenerServiciosDia
);
router.get('/semana',
    auth,
    servicioController.obtenerServiciosSemana
);
router.get('/mes',
    auth,
    servicioController.obtenerServiciosMes
);
router.get('/ano',
    auth,
    servicioController.obtenerServiciosAno
);

//Añade un usuario compartido al servicio
router.put('/comparte',
    auth,
    servicioController.compartirServicio
);

//Actualiza servicio via id
router.put('/:id',
    auth,
    [
        check('idservicio', 'El No. servicio del servicio es obligatorio').not().isEmpty(),
        check('salida', 'La salida del servicio es obligatorio').not().isEmpty(),
        check('cliente', 'El cliente del servicio es obligatorio').not().isEmpty(),
        check('ttoo', 'El ttoo del servicio es obligatorio').not().isEmpty(),
        check('conductor', 'El conductor del servicio es obligatorio').not().isEmpty(),
        check('vehiculo', 'El vehiculo del servicio es obligatorio').not().isEmpty(),
        check('refvuelo', 'La refvuelo del servicio es obligatorio').not().isEmpty(),
        check('llegada', 'La llegada del servicio es obligatorio').not().isEmpty(),
        check('zona', 'El zona del servicio es obligatorio').not().isEmpty(),
        check('adultos', 'Los adultos del servicio es obligatorio').not().isEmpty(),
        check('ninos', 'Los niños del servicio es obligatorio').not().isEmpty(),
        check('pasageros', 'Los pasageros del servicio es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo del servicio es obligatorio').not().isEmpty(),
        check('fecha', 'La fecha del servicio es obligatorio').not().isEmpty(),
        check('horainicio', 'La horainicio del servicio es obligatorio').not().isEmpty(),
        check('precio', 'El precio del servicio es obligatorio').not().isEmpty()

    ],
    servicioController.actualizarServicio
);

//Eliminar servicio via id
router.delete('/:id',
    auth,
    servicioController.eliminarServicio
);

//Elimina un usuario compartido al servicio
router.delete('/comparte/:id&:iduser',
    auth,
    servicioController.eliminarCompartido
);

module.exports = router;