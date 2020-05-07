/**
 * CONTROLADOR DE USUARIOS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const User  = require ('../models/users').UserModel;


class UsersController {

    /**
     * GET all. Devueleve una lista con todas los elementos del repositorio
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async users (req, res, next) {
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0, 
            limit: parseInt(req.query.limit, 10) || 10
        };
        // Por si queremos buscar por un campo
        const searchOptions = {
            search_field: req.query.search_field || 'username', // Campo por defecto para la búsqueda
            search_content: req.query.search_content || '',
            search_order: req.query.search_order || 'asc'
        };

        try {
            const data = await User().getAll(pageOptions, searchOptions);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }


    /**
     * GET por id. Devuelve uneun elemento en base a su ID
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async userById (req, res, next) {
        try {
            const data = await User().getById(req.params.id);
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese ID: ${req.params.id}`
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
    async addUser (req, res, next) {
        // Creamos la receta
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


    async register (req, res, next) {
    
    }


    async editUserById (req, res, next) {
    
    }


    async deleteUserById (req, res, next) {
    
    }


    

}

// Exportamos el módulo
module.exports = new UsersController();