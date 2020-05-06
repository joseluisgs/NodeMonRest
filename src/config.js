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
};