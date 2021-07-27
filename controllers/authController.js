const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer email y password
    const { email, password } = req.body;

    try{
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //Revisar el password. Compara el password de la bd con el password que le estamos pasando
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).send({msg : 'Password Incorrecto'});
        }

        //Si todo es correcto creamos el jwt
        //Crear y firmar jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion
            res.json({token: token});

        });

    }catch(error){
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}


exports.usuarioAutenticado = async (req, res) => {
    try {
        //cogemos los datos del usuario que coincida la id que se ha autenticado en el middleware, cogemos todos los atributos menos el password
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}