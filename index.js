const express = require('express');

const app = express();
const mysql = require('mysql2');

//motor de plantilla
const hbs = require('hbs');
//encontrar archivos
const path = require('path');
//enviar mails
const nodemailer = require('nodemailer');
const { appendFile, read } = require('fs');

//variables de entorno
require('dotenv').config();

//configuramos el puerto
const APP_PORT = process.env.APP_PORT 

//middelware funciones que dan info a json

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


//configuramos el motor de plantillas de HBS
app.set('view engine', 'hbs');

//configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views'));

//configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//Conexión a la Base de Datos
const conexion = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
})

conexion.connect((err) =>{
    if(err) throw err;
    console.log(`Conectado a la Database ${process.env.MYSQL_DATABASE}`);
})

//rutas de la aplicacion



app.get('/', (req, res) => {
    res.render('index', {
        titulo: 'main'
    })
});

app.get('/formulario', (req, res) => {
    res.render('formulario')
});

app.get('/productos', (req, res) => {
    
    let SQL = "SELECT * from productos";
        conexion.query(SQL, function(err, result){
            if (err) throw err;
                console.log(result);
                res.render('productos', {
                titulo: 'Productos',
                datos: result
                })
        })
        
    });

app.get('/contacto', (req, res) => {
    res.render('contacto', {
        titulo: 'Contacto'
    })
});

app.get('/datepicker', (req, res) => {
    res.render('./datepicker', {
        titulo: 'datepicker'
    })
});
 
app.post('/formulario', (req, res) => {
    console.log(req);
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;

    let datos ={ 
        nombre: nombre,
        precio: precio,
        descripcion: descripcion
    };

    let SQL = "insert into productos set ?";

    conexion.query(SQL, datos, function(err){
        if (err) throw err;
            res.render('formulario') 
    })
}) ;


app.post('/contacto', (req, res) =>{
    const nombre = req.body.nombre;
    const email = req.body.email;
    console.log("los datos son: " + nombre + ", " + email);

    //creamos una funcion para enviar el mail
    async function envioMail(){
        //configuramos la cuenta de envío
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
                
        });
        //envío del mail
        let info = await transporter.sendMail({
            from: process.env.email,
            to: `${email}`,
            subject: "gracias por suscribirte a nuestra app",
            html: `Muchas gracias por visitar nuestra página <br>
                Recibirás nuestras promociones a esta dirección de correo.<br>
                Buen fin de semana`
        })
    }

    let datos = {
        nombre: nombre,
        email: email
    }
    
    let sql = "insert into contacto set ?";
    
    conexion.query(sql, datos, function(error){
        if (error) throw error;
        console.log('1 registro insertado');
        envioMail().catch(console.error);
    })
    
    res.render('contacto');
});
   


// servidor a la escucha de las peticiones
app.listen(APP_PORT, ()=>{
    console.log(`Servidor trabajando en 
    el puerto: ${APP_PORT}`);

})
