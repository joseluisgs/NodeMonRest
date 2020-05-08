/**
 * ENRUTADOR DE FICHEROS 
 * Enruta las peticiones para la subida de ficheros
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const filesController = require('../controllers/files');
const auth = require('../middlewares/auth').auth; // es equivalente a poner const auth = requiere ('...').auth;

// Cargamos el enrutador
const router = express.Router();

// Ruta POST File, sube un fichero, si estás identificado
router.post('/', filesController.uploadFiles);


// Exprotamos el módulo
module.exports = router;