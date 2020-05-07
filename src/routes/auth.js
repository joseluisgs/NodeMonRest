/**
 * ENRUTADOR DE AUTORIZACION 
 * Enruta las peticiones para autorización basadas en JWT
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');
const authController = require('../controllers/auth');
const auth = require('../middlewares/auth').auth; // es equivalente a poner const auth = requiere ('...').auth;

// Cargamos el enrutador
const router = express.Router();

// Ruta POST Login
router.post('/login', authController.login);

// Ruta POST. Genera nuevos tokens de acceso basado en el sistema de refreso. Solo autenticados
router.post('/token', auth, authController.token);

// Ruta POST. Logout. solo autenticados
router.post('/logout', auth, authController.logout);


// Exprotamos el módulo
module.exports = router;