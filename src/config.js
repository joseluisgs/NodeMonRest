/**
* CONFIGURACIÓN DE SERVIDOR API REST
* Configuración principal de nuestro servidor
*/


// Librerías
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const handlebars = require('express-handlebars');
const env = require('./env');

// Creamos el módulo de configurar. Es una función que recibe Up
exports.setConfig = (app) => {
  // Quitamos la cabecera que indica que esta hecho con express, por seguridad, así nod amos pistas
  app.disable('x-powered-by');

  // Cargamos la configuracion y se la asignamos al servidor.
  // app.set('env', config.ENV); // lee la etiqueta ENV
  // app.set('config', config); // le pasamos toda la configuracion
  // eslint-disable-next-line no-param-reassign
  // app.locals.env = app.get('env'); // Creamos variables locales en app àra usarlas en otros lugares del código
  // eslint-disable-next-line no-param-reassign
  // app.locals.config = app.get('config'); // Creamos y almacenamos la configuración para usarla en otra parte del código

  // Middleware Le indicamos el midlleware morgan a usar logger.
  // Nos dara información de las peticiones y de todo
  if (env.NODE_ENV !== 'test') {
    // Si no estamos en test sacamos los logs
    app.use(logger('dev'));
  }

  // Parseamos todos los peticiones POST y lo que nos llege a JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Indicamos los cors. Por si nos llega una peticion de una URL distintas
  // Nos permite configurar cabeceras y peticiones los que nos llegue
  app.use(cors());

  /* Indicamos las ruta estática para servidor elemntos estaticos o almacenar cosas
  Así podemos redireccionar rutas internas y no las muestran. si no queremos hacer eso lo quitamos
  Cada vez que pongamos /files, nos llevara al directorio public/files.
  Es decir cda vez que ponga http://..../files/lo que sea, leera el fichero lo que sea que este en public/uploads */
  app.use(
    `/${env.FILES_URL}`,
    express.static(path.join(__dirname, `public/${env.FILES_URL}`)),
  );

  // Configuramos el sistema de ficheros de subida
  app.use(fileUpload(
    {
      createParentPath: true,
      limits: { fileSize: env.FILE_SIZE * 1024 * 1024 * 1024 }, // 2MB max en env
      useTempFiles: true, // Uso de ficheros temporales
      tempFileDir: '/tmp/', // Usamos un directorio y ficheros temporal y no memoria para el proceso de subida.
      preserveExtension: true, // dejamos la extensión por defecto
      debug: env.DEBUG, // Modo de depuración
    },
  ));

  // Configuramos handlebars como motor de plantillas
  handlebars.registerPartials = `${__dirname}/views/partials`; // Registro de fragmentos parciales.
  handlebars.layoutsDir = `${__dirname}/views/layouts`; // Directorio de Layouts
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'hbs');
  app.engine('hbs', handlebars({
    extname: 'hbs', // extensión
    defaultLayout: 'index', // layout por defecto
  }));

  // Carpetas para CSS y JS, boostrapt y jQuery los cargo por web
  app.use('/css', express.static(`${__dirname}/public/css`));
  app.use('/js', express.static(`${__dirname}/public/js`));
  app.use('/res', express.static(`${__dirname}/public/res`));


  // Ruta publica por defecto
  app.use(express.static('public'));
};
