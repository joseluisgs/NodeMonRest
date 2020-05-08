/**
 * ENRUTADOR DE FICHEROS 
 * Enruta las peticiones para la subida de ficheros
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const filesController = require('../controllers/files');
const auth = require('../middlewares/auth').auth;
const permit = require('../middlewares/auth').permit;

// Cargamos el enrutador
const router = express.Router();

// Ruta POST File, sube un fichero, si estás identificado
router.post('/upload', auth, filesController.addFiles);

//ruta GET File, lista todos los ficheors. Solo admin
router.get('/all', auth, permit(['admin']), filesController.files); 

// GET Obtiene un elemento por por ID
router.get('/file/:id', auth, permit(['admin']), filesController.fileById); 

// GET Obtiene los ficheros del usuario actual
router.get('/me', auth, permit(['admin']), filesController.myFiles); 

// DELETE Elimina el fichero

// De la misma manera podríamos hacer un CRUD completo, pero no es el caso


// Exprotamos el módulo
module.exports = router;