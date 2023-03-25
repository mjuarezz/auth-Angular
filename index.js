
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConection } = require('./db/config')
require('dotenv').config();



// Crear servidor / aplicacion de express
const app = express();

//Base de datos
dbConection();


// Directorio publico
app.use( express.static('public') );


// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );


// Rutas 
app.use( '/api/auth', require('./routes/auth') )

// Manejar demas rutas
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
})

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT } `)
});
