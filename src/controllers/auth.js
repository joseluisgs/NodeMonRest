/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Controlador de autenticación.
 */

'use strict';

// Librerias
const jwt = require ('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const User  = require ('../models/users').UserModel;



// Tenemos dos formas si usa Query Params: localhost:8000/auth/login?email=corre@correo.com
// Debemos usar req.query.email
// Si usa el body con un JSON: localhost:8000/auth/login, 
// usamos req.body.email
// Voy a obtar por este último método

// Autentificación
class AuthController {

    /**
     * Devuelve un token al usuario si se autentica correctamente
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async login (req, res, next) {
        // Tenemos dos formas depasar los datos. si usa Query Params: localhost:8000/auth/login?email=corre@correo.com. Debemos usar req.query.email
        // Si usa el body con un JSON: localhost:8000/auth/login. Debemos usar req.body.email
        const {username, email, password} = req.body; // Los tomo ambos del tiron
        
        // Aquí deberíamos hacer las comprobaciones de que existe ese usuario en la BD o que las contraseñas son correctas, etc.

        const user = await User().getByEmail(email);
        console.log(user);
          
        // Si no existe o no se encuetra, o no copiciden las contraseñas
        if (!user || (password != user.password)) {
            return res
                .status(401)
                .send(
                    {   
                        error: '401',
                        message: 'Usuario o password incorrectos' 
                    });
        }

        //  Costruimos el token de acceso
        const payload = {
            username: username,
            email: email,
            roles: user.roles,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * req.app.locals.config.TOKEN_LIFE),
        };
        const token = jwt.encode(payload, req.app.locals.config.TOKEN_SECRET);

        // Creamos el token de refreso
        const refreshToken = uuidv4(); // Numero de refresco de token ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        // En nuestra lista de tokesn de refresco en la pisución de uuid metemos el usuario. Lo ideal sería hacerlo en la BD 
        req.app.locals.refreshTokens[refreshToken] = username;
        console.log('Tokens de refreso: ' + req.app.locals.refreshTokens[refreshToken]);

        return res
            .status(200)
            .send({ token: token, refreshToken: refreshToken }); // Le mandamos el token y el token de refreso
    }

    /**
     * Devuleve el token de refreso. El token se le pasa en el body.
     * Para elo necesitamos vía body, el usuario y su refreshToken
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    token(req, res, next) {
        // Estos son los parámetros que nos pasa en su body
        const username = req.body.username;
        const refreshToken = req.body.refreshToken;
        const email = req.body.email;
        const roles = req.body.roles;
        
        // Si no hay token de refresco y ese token es de nuestro usuario, genero un nuevo token. si no error de autenticación
        console.log(req.app.locals.refreshTokens[refreshToken]);
        if((refreshToken in req.app.locals.refreshTokens) && (req.app.locals.refreshTokens[refreshToken] == username)) {
            //  Costruimos el token de acceso
            const payload = {
                username: username,
                email: email,
                roles: roles,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (60 * req.app.locals.config.TOKEN_LIFE),
            };
            const token = jwt.encode(payload, req.app.locals.config.TOKEN_SECRET);

            // Le mandamos el nuevo token
            return res
                .status(200)
                .send({ token: token, refreshToken: refreshToken }); // Le mandamos el token y el token de refreso
        }
        return res
            .status(401)
            .send(
                {   
                    error: '401',
                    message: 'Usuario no identificado o sesión terminada' 
                });
    }

    logout(req, res, next) {
        // Le pasamos el refress por body y el usuario
        const username = req.body.username;
        const refreshToken = req.body.refreshToken;
        if((refreshToken in req.app.locals.refreshTokens) && (req.app.locals.refreshTokens[refreshToken] == username)) {
            // Lo borramos, podríamos hacerlo de la base de datos
            delete req.app.locals.refreshTokens[refreshToken];
            return res
                .status(204)
                .send(
                    {   
                        error: '204',
                        message: 'Logout' 
                    });
        }
        return res
            .status(401)
            .send(
                {   
                    error: '401',
                    message: 'Usuario no identificado o sesión terminada' 
                });
        
    }
}

// Exportamos el módulo
module.exports = new AuthController();
