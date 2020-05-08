/**
 * CONTROLADOR DE FICHEROS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const config = require ('../config');
const path = require('path');

class FilesController {

    

    /**
     * POST. Añade una imagen al directorio file
     * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async uploadFiles (req, res, next) {
        try {
            if(!req.files || Object.keys(req.files).length === 0) {
                res.send({
                    status: 400,
                    message: 'No hay fichero para subir'
                });
            } else {
                //debemos usar el mismo nombre que lleva en el formulario
                const file = req.files.file;                    // Obtenems el fichero
                const fileName = file.name.replace(/\s/g,'');   // Si tienes espacios en blanco se los quitamos
                const fileExt =  fileName.split('.').pop();     // Nos quedamos con su extension
                const fileDest = file.md5+'.'+fileExt;          //this.getStorageName(file);
                
                // usamos filename para moverla
                file.mv(config.storage.FILES + fileDest);
    
                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        filePath: req.protocol + "://" + req.hostname + '/' + file.name,
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
    
}

// Exportamos el módulo
module.exports = new FilesController();