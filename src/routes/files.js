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
router.post('/', auth, filesController.uploadFiles);

//ruta GET File, lista todos los ficheors. Solo admin
router.get('/', auth, permit(['admin']), filesController.files); 

// De la misma manera podríamos hacer un CRUD completo, pero no es el caso


// Exprotamos el módulo
module.exports = router;