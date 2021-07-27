const Servicio = require('../models/Servicio');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.crearServicio = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }
    try{
        //numero servicio
        const { idservicio } = req.body; 
        //Comprobamos que no existe el servicio
        const existeservicio = await Servicio.findOne({ creador: req.usuario.id, idservicio: idservicio });
 
        if(existeservicio){
            return res.status(400).json({msg: `El servicio ${idservicio} ya esta creado`});
        }

        //Crear un nuevo proyecto
        const servicio = new Servicio(req.body);

        //Guardar el creador via JWT. En el middleware que se llama antes que este (auth), se guarda el id del usuario en req.usuario
        servicio.creador = req.usuario.id;
        servicio.salida = servicio.salida.trim();
        servicio.llegada = servicio.llegada.trim();
      
        //Guardamos el proyecto
        servicio.save();
        res.json(servicio);
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene el servicio que tenga la referencia de servicio especificada
exports.obtenerServicioID = async (req, res) => {
    const { id } = req.query
    console.log(id);
    try{
        // revisar el id
        let servicio = await Servicio.find({$or: [{creador: req.usuario.id}, {compartido: {$elemMatch :{id: req.usuario.id} } }], idservicio: id});
        // console.log(servicio);
        //si el servicio existe o no
        if(!servicio){
            return res.status(404).json({msg: 'Servicio no encontrado'});
        }

        res.json({servicio});

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los servicios del dia especificado
exports.obtenerServiciosDia = async (req, res) => {
    const { ano, mes, dia } = req.query;
    const diafecha = parseInt(dia)+1;
    const fecha = new Date(ano,mes,diafecha);
    fecha.setUTCHours(0);
    try{

        const servicios = await Servicio.find({$or: [{creador: req.usuario.id}, {compartido: {$elemMatch :{id: req.usuario.id} } }], fecha: fecha}).sort({ fecha: -1 });
         console.log(servicios);
        res.json({servicios});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
//Obtiene todos los servicios de la semana especificada 
exports.obtenerServiciosSemana = async (req, res) => {
    const { ano, mes, dia } = req.query;
    const hoy = new Date(ano,mes, parseInt(dia)+1);
    let diasemana = hoy.getDay();
    if( diasemana === 0 ){
        diasemana = 5;
    }else if( diasemana === 1){
        diasemana = 6;
    }else{
        diasemana -= 1;
    }

    const fechamin = new Date();
    fechamin.setFullYear(ano);
    fechamin.setMonth(mes);
    fechamin.setDate(parseInt(dia) - diasemana);
    const fechamax = new Date( );
    fechamax.setFullYear(ano);
    fechamax.setMonth(mes);
    fechamax.setDate(parseInt(dia) - diasemana + 7);

    

    try{
        const servicios = await Servicio.find({ $or: [{creador: req.usuario.id}, {compartido: {$elemMatch :{id: req.usuario.id} } }], fecha: {$gte : fechamin, $lt : fechamax }}).sort({ fecha: -1 });
        res.json({servicios});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


//Obtiene todos los servicios del mes especificado
exports.obtenerServiciosMes = async (req, res) => {
   
    const { ano, mes } = req.query;
    const fechamin = new Date();
    fechamin.setFullYear(ano);
    fechamin.setMonth(parseInt(mes));
    fechamin.setDate(1);

    const fechamax = new Date();
    fechamax.setFullYear(ano);
    fechamax.setMonth(parseInt(mes)+1);
    fechamax.setDate(1);

    // console.log(fechamax);
    // console.log(fechamin);

    try{

        const servicios = await Servicio.find({ $or: [{creador: req.usuario.id}, {compartido: {$elemMatch :{id: req.usuario.id} } }], fecha: {$gte : fechamin, $lt : fechamax }}).sort({ fecha: -1 });
        res.json({servicios});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los servicios del ano especificado
exports.obtenerServiciosAno = async (req, res) => {
    
    const { ano } = req.query;
    const fechamin = new Date();
    fechamin.setFullYear(ano);
    fechamin.setMonth(0);
    fechamin.setDate(1);

    const fechamax = new Date();
    fechamax.setFullYear(parseInt(ano) + 1);
    fechamax.setMonth(0);
    fechamax.setDate(1);

    try{
        
        const servicios = await Servicio.find({ $or: [{creador: req.usuario.id}, {compartido: {$elemMatch :{id: req.usuario.id} } }], fecha: {$gte : fechamin, $lt : fechamax }}).sort({ fecha: -1 });
        res.json({servicios});
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
//Agrega un usuario a compartir
exports.compartirServicio = async(req, res) => {
    //console.log(req.body);
    const { id, email } = req.body.params;

    try{
        //console.log(email);
        //console.log(id);
        // revisar el id
        let servicio = await Servicio.findById(id);

        //si el servicio existe o no
        if(!servicio){
            return res.status(404).json({msg: 'Servicio no encontrado'});
        }
        console.log(req.usuario.id);
        //verificar el creador del servicio
        if(servicio.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //verificar la existencia del correo 
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }
        //verificar que no este ya compartido el servicio a ese usuario
        if(servicio.compartido.includes(usuario.id)){
            return res.status(400).json({msg: 'El usuario ya esta compartido'});
        }

        servicio.compartido.push({id: usuario.id, nombre: usuario.nombre});

        servicio.save();
        res.json({servicio});

    }catch(error){
        res.status(500).send('Error en el servidor');
    }
}
//Actualiza un servicio
exports.actualizarServicio = async(req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Extraerla informacion del servicio
    const { idservicio, salida, cliente, ttoo, 
            fecha, horainicio, letreros, 
            conductor, vehiculo , refvuelo, horavuelo,
            pasageros, llegada, zona, adultos,
            ninos, observaciones, tipo,precio } = req.body;
            
    const nuevoServicio = {};

    try{

        // revisar el id
        let servicio = await Servicio.findById(req.params.id);
        console.log(servicio);

        //si el servicio existe o no
        if(!servicio){
            return res.status(404).json({msg: 'Servicio no encontrado'});
        }

        //verificar el creador del servicio
        if(servicio.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

   

        if(idservicio) nuevoServicio.idservicio = idservicio;
        if(salida) nuevoServicio.salida = salida;
        if(cliente) nuevoServicio.cliente = cliente;
        if(ttoo) nuevoServicio.ttoo = ttoo;
        if(conductor) nuevoServicio.conductor = conductor;
        if(vehiculo) nuevoServicio.vehiculo = vehiculo;
        if(refvuelo) nuevoServicio.refvuelo = refvuelo;
        if(horavuelo) nuevoServicio.horavuelo = horavuelo;
        if(pasageros) nuevoServicio.pasageros = pasageros;
        if(llegada) nuevoServicio.llegada = llegada;
        if(adultos) nuevoServicio.adultos = adultos;
        if(ninos) nuevoServicio.ninos = ninos;
        if(observaciones) nuevoServicio.observaciones = observaciones;
        if(tipo) nuevoServicio.tipo = tipo;
        if(precio) nuevoServicio.precio = precio;
        if(zona) nuevoServicio.zona = zona;
        if(fecha) nuevoServicio.fecha = fecha;
        if(horainicio) nuevoServicio.horainicio = horainicio;
        if(letreros) nuevoServicio.letreros = letreros;

        // actualizar el servicio
        servicio = await Servicio.findByIdAndUpdate({_id: req.params.id },{ $set:
        nuevoServicio}, {new: true});

        res.json({servicio});
        
    }catch(error){
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Elimina un servicio por su id
exports.eliminarServicio = async(req, res) => {

    try{

        // revisar el id
        let servicio = await Servicio.findById(req.params.id);

        //si el servicio existe o no
        if(!servicio){
            return res.status(404).json({msg: 'Servicio no encontrado'});
        }
        
        //verificar si es un usuario compartido
        if(servicio.compartido.includes(req.usuario.id)){
            let listacompartido = servicio.compartido.map(usuariocompartido=>{
                usuariocompartido.id !== req.usuario.id
            });
    
            servicio.compartido = listacompartido;
            servicio.save();
           return res.json({msg: 'Usuario desvinculado'});
        }

        //verificar el creador del servicio
        if(servicio.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // eliminar el servicio
        await Servicio.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Proyecto eliminado'});
        
    }catch(error){
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}



//Agrega un usuario a compartir
exports.eliminarCompartido = async(req, res) => {
  
    const { id, iduser } = req.params;
    
    try{
        // revisar el id
        let servicio = await Servicio.findById(id);

        //si el servicio existe o no
         if(!servicio){
             return res.status(404).json({msg: 'Servicio no encontrado'});
         }

         //verificar el creador del servicio
         if(servicio.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No autorizado'});
         }

        
        //verificar que no este ya compartido el servicio a ese usuario
        if(servicio.compartido.includes(iduser)){
            return res.status(400).json({msg: 'El usuario ya esta compartido'});
        }

        servicio.compartido = servicio.compartido.filter(serv => serv.id !== iduser); 
        servicio.save();
        res.json({msg: 'Usuario compartido eliminado'});

    }catch(error){
        res.status(500).send('Error en el servidor');
    }
}