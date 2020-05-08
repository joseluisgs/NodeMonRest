/**
 * CONTROLADOR DE USUARIOS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const User  = require ('../models/users').UserModel;
const File  = require ('../models/files').FileModel;
const fs = require('fs');
const conf = require('dotenv');
const config = require ('../config');

const SETTINGS = conf.config();

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
     * PUT por id. Modifica un elemento en base a su id
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async editUserById (req, res, next) {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            roles: req.body.roles,
            avatar: req.body.avatar
        };
        try {
            const data = await User().findOneAndUpdate({ _id: req.params.id },newUser);
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
     * Elimina un elemento en base a su ID. 
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async deleteUserById (req, res, next) {
        try {
            const data = await User().findByIdAndDelete({ _id: req.params.id });
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
     * PATCH por username. Modifica la imagen del usuario. Si no tiene la inserta, si tiene la borra y pone la nueva. Deveuleve el usuario actualizado
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async avatarToUser (req, res, next) {
        if(!req.files || Object.keys(req.files).length === 0) {
            res.send({
                status: 400,
                message: 'No hay fichero para subir'
            });
        } else {
            // Obtengo el fichero del avatar del usuario
            const avatarOld= await File().getUserAvatar(req.params.username);
            
            // Proceso el fichero el archivo nuevo
            const file= req.files.avatar;
            const fileName = file.name.replace(/\s/g,'');   // Si tienes espacios en blanco se los quitamos
            const fileExt =  fileName.split('.').pop();     // Nos quedamos con su extension
            const fileDest = file.md5+'.'+fileExt;          //this.getStorageName(file);
            const newFile= File()({
                file: fileDest,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.hostname}:${SETTINGS.parsed.PORT}/${SETTINGS.parsed.FILES_URL}/${fileDest}`,
                username: req.params.username,
                type: 'avatar'
            });

            try {
            
                // Actualizo la foto en el usuario
                const newUser = {
                    avatar: `${req.protocol}://${req.hostname}:${SETTINGS.parsed.PORT}/${SETTINGS.parsed.FILES_URL}/${fileDest}`
                };
                const newData = await User().findOneAndUpdate({ username: req.params.username },newUser);

                // Copio la nueva imagen en disco y BD
                file.mv(config.storage + fileDest);
                await newFile.save();

                // Elimino la antigua de la BD y la borro
                fs.unlink(config.storage + avatarOld.file, async function (err) {
                    if (err) throw err;
                    console.log('Fichero borrado');
                    const data = await File().findByIdAndDelete({  _id : avatarOld._id });
                    if (data) {
                        res.status(200).json(newData);
                    } else { 
                        res.status(404).json({
                            'error':404,
                            'mensaje': `No se ha encontrado un item con ese ID: ${avatarOld.file}`
                        });
                    }
                });
            } catch (err) {
                res.status(500).send(err);
            }  
        }
    }
}

// Exportamos el módulo
module.exports = new UsersController();