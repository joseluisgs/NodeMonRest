/**
 * ENRUTADOR DE USUARIOS
 * Enruta las peticiones al recurso de usuarios llamando al controlador y métodos adecuados
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');

// Controladores
const usersController = require('../controllers/users');

// Cargamos el enrutador
const router = express.Router();

// Para securizar ponemos auth en la ruta que queramos. Por ejemplo vamos a securizar añadir, modificar y borrar
// Para más aclaraciones mirad el controlador recipes
const auth = require('../middlewares/auth').auth; // es equivalente a poner const auth = requiere ('...').auth;
const permit = require('../middlewares/auth').permit;


// GET Listar todos los elementos, solo admin puede
router.get('/', auth, permit(['admin']), usersController.users); 

// GET Obtiene un elemento por por ID
router.get('/:id', auth, permit(['admin']), usersController.userById); 

// POST Añadir Elemento. Solo el usuario administrador
router.post('/', auth, permit(['admin']), usersController.addUser);

// Modifica un elemento por ID. Solo admin
router.put('/:id', auth, permit(['admin']), usersController.editUserById); 

// Elimina un elemento por ID. Solo Admin puede borrarlos.
router.delete('/:id', auth, permit(['admin']), usersController.deleteUserById); 

//Inserta o actualiza la imagen del un usuario obtenida por un formulario. Antes la hemos tenido que subir con subir con files.upload. Se la pasamos en el body
router.patch('/:username/avatar', auth, usersController.avatarToUser); 

// Exprotamos el módulo
module.exports = router;
