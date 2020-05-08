/**
 * CONTROLADOR DE FICHEROS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const config = require ('../config');
const conf = require('dotenv');
const path = require('path');
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
    async uploadFiles (req, res, next) {
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
       
                files.forEach(file => {
                    const fileName = file.name.replace(/\s/g,'');   // Si tienes espacios en blanco se los quitamos
                    const fileExt =  fileName.split('.').pop();     // Nos quedamos con su extension
                    const fileDest = file.md5+'.'+fileExt;          //this.getStorageName(file);

                    // usamos filename para moverla
                    file.mv(config.storage + fileDest);
                    //Almacenamos los datos
                    data.push({
                        name: fileDest,
                        mimetype: file.mimetype,
                        size: file.size,
                        filePath: `${req.protocol}://${req.hostname}:${SETTINGS.parsed.PORT}/${SETTINGS.parsed.FILES_URL}/${fileDest}`
                    });
                });

                //Mandamos la respuesta
                res.send({
                    status: true,
                    message: 'Fichero(s) subido(s) con éxito',
                    data: data
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    files(req, res, next) {
        console.log('estoy aquí');
        fs.readdir(config.storage.FILES, function(err, files) {
            if (err) {
                console.log("Error getting directory information.");
            } else {
                files.forEach(function(file) {
                    console.log(file);   
                });
            }
        });
    }
}

// Exportamos el módulo
module.exports = new FilesController();