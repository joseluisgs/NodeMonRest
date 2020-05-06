/**
 * ENRUTADOR
 * Enrutador central, lo que hace es llamar a cada enrutador específico por rutas que tengamos en nuestra API
 */

'use strict';

const recipes = require('./routes/recipes');
const auth = require('./routes/auth');
//const user = require('./routes/user');

// exportamos los módulos
module.exports.setRouter = (app) => {
    // indicamos que para ruta quien la debe resolver
    //rutas de autenticación y autorización.
    app.use('/auth', auth);
    // Recursos de Usuarios
    //app.use('/user', user);
    // Recursos Recetas
    app.use('/recipes', recipes);
};