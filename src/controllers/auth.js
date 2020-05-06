/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Controlador de autenticación.
 */

'use strict';

// Librerias
const jwt = require ('jwt-simple');

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
    getToken (req, res, next) {
        // Tenemos dos formas depasar los datos. si usa Query Params: localhost:8000/auth/login?email=corre@correo.com. Debemos usar req.query.email
        // Si usa el body con un JSON: localhost:8000/auth/login. Debemos usar req.body.email
        const {username, email, password} = req.body; // Los tomo ambos del tiron
        // Aquí deberíamos hacer las comprobaciones de que existe ese usuario en la BD o que las contraseñas son correctas, etc.
        const role = ['admin', 'normal'];
        
        // Si no existe o no se encuetra
        if (!username) {
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
            role: role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * req.app.locals.config.TOKEN_LIFE) 
        };

        return res
            .status(200)
            .send({ token: jwt.encode(payload, req.app.locals.config.TOKEN_SECRET) });
    }
}

// Exportamos el módulo
module.exports = new AuthController();
