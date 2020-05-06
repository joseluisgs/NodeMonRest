/**
 * ENRUTADOR DE AUTORIZACION 
 * Enruta las peticiones para autorización basadas en JWT
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const authController = require('../controllers/auth');

// Cargamos el enrutador
const router = express.Router();

// Ruta POST
router.post('/login', authController.getToken);


// Exprotamos el módulo
module.exports = router;