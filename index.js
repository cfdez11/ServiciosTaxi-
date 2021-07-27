const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la BD
conectarDB();

//Habilitar CORS
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

//Puerto de la app //Heroku establece esta variable, en desarrollo el que coge es 4000
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/zonas', require('./routes/zonas'));

//Definir pagina principal
app.get('/',(req, res)=>{
    res.send('Hola Mundo');
});

//Iniciar servidor
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});
