const Servicio = require('../models/Servicio');
const { validationResult } = require('express-validator');
const Zona = require('../models/Zona');

exports.crearZona = async (req, res) => {

    
    //Revisar si hay errores
    const errores = validationResult(req.body.params);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    const { nombre, precio } = req.body.params; 
     

    try{
        
        
        const existezona = await Zona.findOne({creador: req.usuario.id, nombre: nombre });
        if(existezona){
            return res.status(400).json({msg: `La zona ${nombre} ya esta creada`});
        }
        //Crear un nuevo proyecto
        const zonanueva = new Zona({nombre, precio});
        
        //Guardar el creador via JWT. En el middleware que se llama antes que este (auth), se guarda el id del usuario en req.usuario
        zonanueva.creador = req.usuario.id;
        zonanueva.nombre = zonanueva.nombre.trim();

        //Guardamos el proyecto
        zonanueva.save();
        res.json(zonanueva);
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerZonas = async (req, res) => {

    try{
        
        const zonas = await Zona.find({ creador: req.usuario.id });


        res.json({zonas});

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


exports.eliminarZona = async (req, res) => {

    try{
        let existezona = await Zona.findById(req.params.id);
        if(!existezona){
            return res.status(400).json({msg: `La zona ${existezona.nombre} ya esta borrada`});
        }
        if(existezona.creador === req.usuario.id){
            return res.status(400).json({msg: `No autorizado`});
        }
        // eliminar el servicio
        await Zona.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Servicio eliminado'});

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}