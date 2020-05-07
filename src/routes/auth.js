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

// Ruta POST Login
router.post('/login', authController.login);

// Ruta POST. Genera nuevos tokens de acceso basado en el sistema de refreso
router.post('/token', authController.token);

// Ruta POST. Logout
router.post('/logout', authController.logout);


// Exprotamos el módulo
module.exports = router;