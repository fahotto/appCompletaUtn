const express = require('express');
const app = express();
const mysql = require('mysql2');

//motor de plantilla
const hbs = require('hbs');

//encontrar archivos
const path = require('path');

//enviar mails
const nodemailer = require('nodemailer');
const { appendFile } = require('fs');

//variables de entorno
require('dotenv').config();
   
//configuramos el puerto
const PORT = process.env.PORT

//middelware funciones que dan info a json
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

//configuramos el motor de plantillas de handlebars HBS
app.set('view engine', 'hbs');


//config la ubicacion de las plantillas. (ejs pug) son otros

app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views/partials'))

//conexion a la DB
const conexion = mysql.createConnection({
    HOST: process.env.HOST, 
    USER: process.env.USER,
    PORT: process.env.PORT,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
    DBPORT: process.env.DBPORT,
})

conexion.connect((err) => {
    if (err) throw err;
    console.log(`Conectado a ${database.process.database}`);
})

//rutas de la app
app.get('/', (req, res) => {
    res.send('App Completa');
})


//servidor a la escucha de las peticiones
app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
})

