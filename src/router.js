/**
 * ENRUTADOR
 * Enrutador central, lo que hace es llamar a cada enrutador específico por rutas
 * que tengamos en nuestra API
 */

const recipes = require('./routes/recipes');
const auth = require('./routes/auth');
const users = require('./routes/users');
const files = require('./routes/files');


// exportamos los módulos
module.exports.setRouter = (app) => {
  // indicamos que para ruta quien la debe resolver

  // rutas de autenticación y autorización.
  app.use('/auth', auth);

  // Recursos Recetas
  app.use('/recipes', recipes);

  // Recursos de Usuarios
  app.use('/users', users);

  // Recursos de Ficheros
  app.use('/files', files);

  /*
  Tambien podemos crear errores a rutas que no existen
  es un middleware, por eso es un next, si existe vamos a la ruta, si no lanza esto
    app.use((req, res, next) => {
        /* res.status(404).render('404', {
            title: '',
            message: 'La página a la que intentas acceder no existe'
        });
        //next(err); //-->> si añadimos un error de este tipo a las peticiones,
        //podemos enviarlo al error 500 que es el que pilla el error.
        res.status(404).json({
            'error':404,
            'mensaje': 'No existe ningún recurso para esta ruta'
        });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        //res.status(500).send('Algo va mal!');
        res.status(500).json({
            'error':500,
            'mensaje': 'Algo va mal'
        });
    });
 */
};
