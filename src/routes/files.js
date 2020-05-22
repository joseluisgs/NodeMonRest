/**
 * ENRUTADOR DE FICHEROS
 * Enruta las peticiones para la subida de ficheros
 */


// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const filesController = require('../controllers/files');
const { auth } = require('../middlewares/auth');
const { role } = require('../middlewares/auth');

// Cargamos el enrutador
const router = express.Router();

// Ruta POST File, sube un fichero, si estás identificado
router.post('/upload', auth, filesController.addFiles);

// ruta GET File, lista todos los ficheros. Solo admin
router.get('/all', auth, role(['admin']), filesController.files);

// GET Obtiene la información un elemento por por ID
router.get('/id/:id', auth, filesController.fileById);

// GET Obtiene la información elemento por por ID
router.get('/name/:file', auth, filesController.fileByName);

// GET Obtiene los ficheros del usuario actual
router.get('/me', auth, filesController.myFiles);

// GET Obtiene el fichero, es decir el binario del fichero, para descargarlo o mostrarlo en la web, no sus metadatos. No va protegida por ahora
router.get('/:file', filesController.getFile);

// DELETE Elimina el fichero
router.delete('/delete/:id', auth, filesController.deleteFileById);

// Exprotamos el módulo
module.exports = router;
