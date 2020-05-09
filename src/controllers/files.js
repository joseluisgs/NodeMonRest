/**
 * CONTROLADOR DE FICHEROS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const config = require ('../config');
const conf = require('dotenv');
const File  = require ('../models/files').FileModel;
const fs = require('fs');

// Cargamos la configuración del fichero .env
const SETTINGS = conf.config();

class FilesController { 

    /**
     * POST. Añade una imagen al directorio file
     * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async addFiles (req, res, next) {
        try {
            if(!req.files || Object.keys(req.files).length === 0) {
                res.send({
                    status: 400,
                    message: 'No hay fichero para subir'
                });
            } else {
                //debemos usar el mismo nombre que lleva en el formulario
                const data = []; 
                const files = req.files.files;

                // Miramos si son varios ficheros
                const isFiles = Array.isArray(req.files.files);
                console.log(isFiles);

                if(isFiles){
                    files.forEach(async file => {
                        const fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
                        const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
                        const fileDest = file.md5 + '.' + fileExt; //this.getStorageName(file);
                        const newFile = File()({
                            file: fileDest,       
                            mimetype: file.mimetype,
                            size: file.size,
                            url: `${req.protocol}://${req.hostname}:${SETTINGS.parsed.PORT}/${SETTINGS.parsed.FILES_URL}/${fileDest}`,
                            username: req.user.username,
                            type: 'document'
                        });
                        // usamos filename para moverla al sistema de almacenamiento
                        file.mv(config.storage + fileDest);
                        //Almacenamos los datos en la base de datos y los metemos en el array de salida 
                        data.push({ newFile });
                        await newFile.save();
                    });
                }else{
                    const file = req.files.files;
                    const fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
                    const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
                    const fileDest = file.md5 + '.' + fileExt; //this.getStorageName(file);
                    const newFile = File()({    
                        file: fileDest,    
                        mimetype: file.mimetype,
                        size: file.size,
                        url: `${req.protocol}://${req.hostname}:${SETTINGS.parsed.PORT}/${SETTINGS.parsed.FILES_URL}/${fileDest}`,
                        username: req.user.username,
                        type: 'document'
                    });
                    // usamos filename para moverla al sistema de almacenamiento
                    file.mv(config.storage + fileDest);
                    //Almacenamos los datos en la base de datos y los metemos en el array de salida 
                    data.push({ newFile });
                    await newFile.save();
                }

                //Mandamos la respuesta
                res.send({
                    status: true,
                    message: 'Fichero(s) subido(s) con éxito',
                    data: data
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

   

    /**
     * GET all. Devueleve una lista con todas los elementos del repositorio
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async files (req, res, next) {
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
            const data = await File().getAll(pageOptions, searchOptions);
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
    async fileById (req, res, next) {
        try {
            const data = await File().getById(req.params.id);
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
     * GET all. Devueleve una lista con todas los elementos del repositorio que pertenecen a dicho usuario
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async myFiles (req, res, next) {
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0, 
            limit: parseInt(req.query.limit, 10) || 10
        };
        // Por si queremos buscar por un campo
        const searchOptions = {
            search_field: 'username', // Campo por defecto para la búsqueda
            search_content: req.user.username,
            search_order: req.query.search_order || 'asc'
        };

        try {
            const data = await File().getAll(pageOptions, searchOptions);
            res.status(200).json(data);
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
    async deleteFileById (req, res, next) {
        try {
            // Busco el fichero
            const file= await File().getById(req.params.id);

            fs.unlink(config.storage + file.file, async function (err) {
                if (err) throw err;
                console.log('Fichero borrado');
                const data = await File().findByIdAndDelete({ _id: req.params.id });
                if (data) {
                    res.status(200).json(data);
                } else { 
                    res.status(404).json({
                        'error':404,
                        'mensaje': `No se ha encontrado un item con ese ID: ${req.params.id}`
                    });
                }
            });
            
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

// Exportamos el módulo
module.exports = new FilesController();