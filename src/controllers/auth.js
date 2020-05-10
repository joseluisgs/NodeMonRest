/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Controlador de autenticación.
 */

'use strict';

// Librerias
const jwt = require ('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const User  = require ('../models/users').UserModel;
const tokenRefreshController = require('../controllers/tokenRefresh');

// Tenemos dos formas si usa Query Params: localhost:8000/auth/login?email=corre@correo.com
// Debemos usar req.query.email
// Si usa el body con un JSON: localhost:8000/auth/login, 
// usamos req.body.email
// Voy a obtar por este último método

// Autentificación
class AuthController {

    /**
     * Devuelve un token al usuario si se autentica correctamente. Genera el token de refresco
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
            username: user.username,
            email: email,
            roles: user.roles,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * req.app.locals.config.TOKEN_LIFE),
        };
        const token = jwt.encode(payload, req.app.locals.config.TOKEN_SECRET);

        // Creamos el token de refreso
        const uuid = uuidv4(); // Numero de refresco de token ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        // Almaceno en la BD el Tocken
        await tokenRefreshController.save(username, uuid);  
        return res
            .status(200)
            .send({ token: token, refreshToken: uuid }); // Le mandamos el token y el token de refreso
    }

    /**
     * Devuleve el token nuevo. El token se le pasa en el body.
     * Para elo necesitamos vía body, el usuario y su refreshToken
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async token(req, res, next) {
        // Estos son los parámetros que nos pasa en su body
        const username = req.body.username;
        const refreshToken = req.body.refreshToken;
        const email = req.body.email;
        const roles = req.body.roles;
        
        // Buscamos el token refresh
        const tokenRefresh = await tokenRefreshController.findByUUID(refreshToken);
        
        // Si hay token de refresco y ese token es de nuestro usuario, genero un nuevo token. si no error de autenticación
        if((tokenRefresh) && (tokenRefresh.username == username)) {
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

    /**
     * Realiza el logout y elimina el token de refresco
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async logout(req, res, next) {
        // Le pasamos el refress por body y el usuario
        const username = req.body.username;
        const refreshToken = req.body.refreshToken;

        // Buscamos el token refresh
        const tokenRefresh = await tokenRefreshController.findByUUID(refreshToken);

        if((tokenRefresh) && (tokenRefresh.username == username)) {
            // Lo borramos, podríamos hacerlo de la base de datos
            await tokenRefreshController.deleteByUUID(refreshToken);
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

    /**
     * GET Devuelve los datos del elemento activo
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async aboutMe (req, res, next) {
        try {
            const data = await User().getByUserName(req.user.username);
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado usuario: ${req.user.username}`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * POST. Añade un elemento al repositorio
     * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async registerMe (req, res, next) {
        // Creamos el usuario
        const newUser= User()({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            roles: req.body.roles,
            avatar: req.body.avatar
        });
        try {
            const data = await newUser.save();
            res.status(201).json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * PUT Modifica el elemento actual
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async updateMe (req, res, next) {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar
        };
        try {
            const data = await User().findOneAndUpdate({ username: req.user.username }, newUser);
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese nombre de usuario: ${req.user.username }`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * Elimina un elemento en base a su ID. 
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async deleteMe (req, res, next) {
        try {
            const data = await User().findOneAndDelete({ username: req.user.username });
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese npmbre de usuario: ${req.user.username }`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

}

// Exportamos el módulo
module.exports = new AuthController();
