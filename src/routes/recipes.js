/**
 * ENRUTADOR DE RECETAS
 * Enruta las recetas llamando al controlador y métodos adecuados
 */

'use strict';

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');

// Controladores
const recipesController = require('../controllers/recipes');

// Cargamos el enrutador
const router = express.Router();

// Para securizar ponemos auth en la ruta que queramos. Por ejemplo vamos a securizar añadir, modificar y borrar
const auth = require('../middlewares/auth').auth; // es equivalente a poner const auth = requiere ('...').auth;
const permit = require('../middlewares/auth').permit;

// Analizamos según la ruta y podemos poner las opciones. También podríamos hacerlo uno anu, por ejemplo: router.get('/:id', recipesController.recipeById);
// Pero considero que así visualmente queda mejor o mas claro las acciones que se hace por ruta. Al gusto del consumidor :)

//Si queremos que la ruta esté atenticada, ponemos auth
// Si queremos que la ruta este autorizada por roles y permisos, ponemos permit y la lista de roles
// Ejemplo: router.get('/', auth, permit(['admin', 'normal']), recipesController.recipes);  ruta para admin o normal,
// Esta claro que si uno es asmin es normal, o no? dependerá del problema y si quremoes que puedan haber rutas de normal que no acceda admin
// o viceversa. Si no se pone es normal

// Listar todos los elementos
router.get('/', auth, permit(['admin', 'normal']), recipesController.recipes); 

// Obtiene un elemento por por ID
router.get('/:id', recipesController.recipeById); 

// Añadir Elemento
router.post('/', recipesController.addRecipe);             

// Modifica un elemento por ID
router.put('/:id', recipesController.editRecipeById); 

// Elimina un elemento por ID
router.delete('/:id', recipesController.deleteRecipeById); 

// Exprotamos el módulo
module.exports = router;
