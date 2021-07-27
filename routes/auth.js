//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//Autentica un usuario
//api/auth

//Primer middleware: Añade un nuevo usuario
router.post('/', 
    // [
    //     check('email', 'Agrega un email válido').isEmail(),
    //     check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6})
    // ],
    authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;