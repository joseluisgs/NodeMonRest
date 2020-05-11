/**
 * ENRUTADOR DE FICHEROS
 * Enruta las peticiones para la subida de ficheros
 */


// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const filesController = require('../controllers/files');
const { auth } = require('../middlewares/auth');
const { permit } = require('../middlewares/auth');

// Cargamos el enrutador
const router = express.Router();

// Ruta POST File, sube un fichero, si estás identificado
router.post('/upload', auth, filesController.addFiles);

// ruta GET File, lista todos los ficheros. Solo admin
router.get('/all', auth, permit(['admin']), filesController.files);

// GET Obtiene un elemento por por ID
router.get('/file/:id', auth, filesController.fileById);

// GET Obtiene los ficheros del usuario actual
router.get('/me', auth, filesController.myFiles);

// DELETE Elimina el fichero
router.post('/delete/:id', auth, filesController.deleteFileById);

// De la misma manera podríamos hacer un CRUD completo, pero no es el caso


// Exprotamos el módulo
module.exports = router;
