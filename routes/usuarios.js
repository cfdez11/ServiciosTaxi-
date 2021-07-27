//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//Crea un usuario
//api/usuarios

//Primer middleware: Añade un nuevo usuario
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    ],
    usuarioController.crearUsuario
);

//Modifica un usuario
router.put('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
    ],
    auth,
    usuarioController.modificarUsuario
);

module.exports = router;