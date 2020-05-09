/**
* CONFIGURACIÓN DE SERVIDOR API REST
* Configuración principal de nuestro servidor
*/

'use strict';

// Librerías
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('dotenv');    // Cogemos el objeto que necesitamos
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const handlebars = require('express-handlebars');

// Cargamos la configuración del fichero .env
const SETTINGS = conf.config();


// Creamos el módulo de configurar. Es una función que recibe Up
module.exports.setConfig= (app) => {
     
    // Quitamos la cabecera que indica que esta hecho con express, por seguridad, así nod amos pistas
    app.disable('x-powered-by');

    // Cargamos la configuracion y se la asignamos al servidor.
    app.set('env', SETTINGS.parsed.ENV);    // lee la etiqueta ENV 
    app.set('config', SETTINGS.parsed);     // le pasamos toda la configuracion
    app.locals.env = app.get('env');        // Creamos variables locales en app àra usarlas en otros lugares del código
    app.locals.config = app.get('config');  // Creamos y almacenamos la configuración para usarla en otra parte del código
          
    // Middleware Le indicamos el midlleware morgan a usar logger. Nos dara información de las peticiones y de todo
    if (process.env.NODE_ENV !== 'test') {
        // Si no estamos en test sacamos los logs
        app.use(logger('dev'));
    }

    // Parseamos todos los peticiones POST y lo que nos llege a JSON
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Indicamos los cors. Por si nos llega una peticion de una URL distintas
    // Nos permite configurar cabeceras y peticiones los que nos llegue
    app.use(cors());

    // Indicamos las ruta estática para servidor elemntos estaticos o almacenar cosas
    // Así podemos redireccionar rutas internas y no las muestran. si no queremos hacer eso lo quitamos
    // Cada vez que pongamos /files, nos llevara al directorio public/files. 
    //Es decir cda vez que ponga http://..../files/lo que sea, leera el fichero lo que sea que este en public/uploads
    app.use(
        `/${SETTINGS.parsed.FILES_URL}`,
        express.static(path.join(__dirname, `public/${SETTINGS.parsed.FILES_URL}`))
    );
    
    // Configuramos el sistema de ficheros de subida
    app.use(fileUpload(
        {
            createParentPath: true,
            limits: { fileSize: SETTINGS.parsed.FILE_SIZE * 1024 * 1024 * 1024 }, //2MB max de tamaño máximo (puesto en env)
            useTempFiles : true,            // Uso de ficheros temporales
            tempFileDir : '/tmp/',          // Usamos un directorio y ficheros temporal y no memoria para el proceso de subida. Ideal para ficheros grandes o muchas subidas
            preserveExtension: true,        // dejamos la extensión por defecto
            debug: SETTINGS.parsed.DEBUG    // Modo de depuración           
        }
    ));

    // Configuramos handlebars como mtor de plantillas
    app.set('view engine', 'hbs');
    app.engine('hbs', handlebars({
        layoutsDir: __dirname + '/views/layouts',
        extname: 'hbs',
        defaultLayout: 'planB',
        partialsDir: __dirname + '/views/partials/'
    }));

    app.use(express.static('public'));

};

// exportamos los directorios de lamcenaminero
module.exports.storage = path.join(__dirname, `public/${SETTINGS.parsed.FILES_PATH}/`);

