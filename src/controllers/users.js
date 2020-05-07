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


    async userById (req, res, next) {
    
    }

    
    async userMe (req, res, next) {
    
    }


    async addUser (req, res, next) {
    
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