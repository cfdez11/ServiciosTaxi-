const jwt = require('jsonwebtoken');
//Hbaria que crear otro jwt cuando se inicia sesion con una duracion sin expiracion, cuando se llame a este 
//middleware, comprobamos si el contenido de x-auth-token, es el token y lo verificamos, en caso de que ya haya expirado,
//habria que comprobar si existe un token en otro header que podriamos llamar x-refresh-token, y en caso de que haya un token,
//y se verifique con SECRETA_REFRESH, se crea un nuevo jwt y se guarda en x-auth-token. En caso de que no haya un token
//en x-refresh-token saltara al catch error. 
//Cuando cambiemos la contraseña
module.exports = function(req, res, next) {

    //Leer el token del header
    const token = req.header('x-auth-token');
    
    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg: 'No hay Token, permiso no válido'});
    }

    //validar el token
    try{
        //Verificamos si el token corresponde con el de la sesion del usuario
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();

    }catch(error){
        res.status(401).json({msg: 'Token no valido'});
    }
}


