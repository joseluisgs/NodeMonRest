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

  // Páginas webs generadas
  // Lo ideal sería crear un dichero de enrutación y un controlador, pero para tres páginas no merece la pena.
  // Pero sería el proceder
  // Una ruta por defecto de presentación
  app.get('/', (req, res) => {
    // Inyecta el fichero main.hbl" dentro de layout index, en su etiqueta Body
    res.render('main', { layout: 'index', titulo: 'NodeMonRest' });
  });
  // Ruta de desarrollo
  app.get('/desarrollo', (req, res) => {
    // Inyecta el fichero main.hbl" dentro de layout index, en su etiqueta Body
    res.render('desarrollo', { layout: 'index', titulo: 'Desarrollo' });
  });
  // Tambien podemos crear errores a rutas que no existen
  // es un middleware, por eso es un next, si existe vamos a la ruta, si no lanza esto
  app.use((req, res) => {
    res.render('error404', { layout: 'index', titulo: 'Error 404. Página no encotrada' });
    // res.status(404).json({
    //   error: 404,
    //   ensaje: 'No existe ningún recurso para esta ruta',
    // });
  });
  // next(err); //-->> si añadimos un error de este tipo a las peticiones,
  // podemos enviarlo al error 500 que es el que pilla el error.
  // res.status(404).json({
  //   error: 404,
  //   mensaje: 'No existe ningún recurso para esta ruta',
  // });

  // app.use((err, req, res, next) => {
  //   console.error(err.stack);
  //   // res.status(500).send('Algo va mal!');
  //   res.status(500).json({
  //     error: 500,
  //     mensaje: 'Algo va mal',
  //   });
  // });
};
