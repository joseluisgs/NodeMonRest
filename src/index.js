/**
 * SERVIDOR
 * Servidor principal de nuestra API
 */

// Carganos la librería
const express = require('express');
const config = require('./config');
const router = require('./router');
const db = require('./database');

let instanceServer; // instancia del servidor

/* const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
 */
// Configuramos el objeto servidor
const server = {


  // iniciamos el servidor
  start() {
    // Cargamos express como servidor
    const app = express();

    // Precedemos de la siguiente manera, no arrancamos el servidor si no tenemos conexión
    // a la base de datos, es decir, cuando se resuleva la promesa
    return db.connect().then(() => {
      // Cuando se resuleve la promesa actuamos
      // Aplicamos la configuracion a
      config.setConfig(app);

      // Una ruta por defecto de presentación
      app.get('/', (req, res) => {
        // Inyecta el fichero main.hbl" dentro de layout index, en su etiqueta Body
        res.render('main', { layout: 'index', titulo: 'NodeMonRest API' });
      });

      // Enrutamiento que hemos creado
      router.setRouter(app);

      // Nos ponemos a escuchar a un puerto definido en la configuracion
      instanceServer = app.listen(app.locals.config.PORT, () => {
        const address = instanceServer.address(); // obtenemos la dirección
        const host = address.address === '::' ? 'localhost' : address; // dependiendo de la dirección asi configuramos
        const port = app.locals.config.PORT; // el puerto
        const url = `http://${host}:${port}`;
        instanceServer.url = url;

        if (process.env.NODE_ENV !== 'test') {
          console.log(`⚑ Servidor API REST escuchando ✓ -> ${url}`);
        }
      });

      // console.log('Password: '+ bcrypt.hashSync('admin123', 10));
      return instanceServer;
    });// Fin de la promesa
    // return instanceServer;
  },

  // Cierra el servidor
  close() {
    // Desconectamos el socket server
    instanceServer.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log('▣  Servidor parado');
    }
  },
};

// Exportamos la variable
module.exports.server = server;

// Si ningun fichero está haciendo un import y ejecutando ya el servidor, lo lanzamos nosotros
if (!module.parent) {
  server.start();
}

process.on('unhandledRejection', (err) => {
  console.log('✕ Custom Error: An unhandledRejection occurred');
  console.log(`✕ Custom Error: Rejection: ${err}`);
});
