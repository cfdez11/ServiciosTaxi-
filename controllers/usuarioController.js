const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer email y password
    const { email, password } = req.body;

    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //Crea nuevo usuario
        usuario = new Usuario(req.body);

        //Hasehar el password
        //Slat evita que haya hashses iguales con las mismas entradas (colisiones)
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

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

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

exports.modificarUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Extraer email y password
    const { nombre, email, password, newpassword } = req.body;

    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findById(req.usuario.id);
        console.log(usuario);

        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //Modificamos el usuario

        if(newpassword!=='') {
            //Revisar el password. Compara el password de la bd con el password que le estamos pasando
            const passCorrecto = await bcryptjs.compare(password, usuario.password);
            if(!passCorrecto){
                return res.status(400).send({msg : 'Contraseña antigua incorrecta'});
            }
            //Hasehar el password
            //Slat evita que haya hashses iguales con las mismas entradas (colisiones)
            const salt = await bcryptjs.genSalt(10);
            usuario.password = await bcryptjs.hash(newpassword, salt);
        }

        //Revisar que el email registrado sea unico
        let usuarioemail = await Usuario.findOne({ email });
      
        if(usuarioemail && usuarioemail.id !== req.usuario.id) {
            return res.status(400).json({msg: 'Usuario registrado con este email'});
        }

        if(nombre) usuario.nombre = nombre;
        if(email) usuario.email = email;
    
        //actualizar usuario
        usuario = await Usuario.findByIdAndUpdate({_id: req.usuario.id },{ $set:
            usuario}, {new: true});
    
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

    } catch (error) {
         console.log(error);
         res.status(400).send('Hubo un error');
    }
}

// exports.recuperarContrasena = async (req, res) => {

//     //Revisar si hay errores
//     const errores = validationResult(req);
//     if(!errores.isEmpty()){
//         return res.status(400).json({errores: errores.array()});
//     }

//     //Extraer email y password
//     const { email } = req.body;

//     let verificationLink;
//     const emailStatus = 'OK';

//     try {
//         //Revisar que el usuario registrado sea unico
//         let usuario = await Usuario.findOne({ email });

//         if(!usuario) {
//             return res.status(400).json({msg: 'El usuario no existe'});
//         }
        

//         //Crear y firmar jwt
//         const payload = {
//             usuario: {
//                 id: usuario.id
//             }
//         };

//         //Firmar jwt
//         let token = jwt.sign(payload, process.env.SECRETA, {
//             expiresIn: 3600
//         }, (error, token) => {
//             if(error) throw error;

//             //mensaje de confirmacion
//             res.json({token: token});

//         });   
//         //verificationLink = 'http://localhost:4000/new'
//         usuario.resetToken = token;
//         await usuario.save();
//     } catch (error) {
//         console.log(error);
//         res.status(400).send('Hubo un error');
//     }

//     //enviar email

//     try{

//     }catch(error){

//     }
// }

// exports.crearNuevaContrasena = async (req, res) => {
//     const {newpassword} = req.body;
//     const resetToken = req.headers.reset as string;

//     if(!(resetToken && newpassword)){
//         res.status(400).json({message : 'Todos los campos son requeridos'});
//     }


// }
