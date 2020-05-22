/**
 * ENRUTADOR DE RECETAS
 * Enruta las recetas llamando al controlador y métodos adecuados
 */


// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
const express = require('express');

// Controladores
const recipesController = require('../controllers/recipes');

// Cargamos el enrutador
const router = express.Router();

// Para securizar ponemos auth en la ruta que queramos.
const { auth } = require('../middlewares/auth'); // es equivalente a poner const auth = requiere ('...').auth;
const { role } = require('../middlewares/auth');

/* Analizamos según la ruta y podemos poner las opciones. También podríamos hacerlo uno anu,
por ejemplo: router.get('/:id', recipesController.recipeById);
Pero considero que así visualmente queda mejor o mas claro las acciones que se hace por ruta.
Al gusto del consumidor :) */

/* Si queremos que la ruta esté atenticada, ponemos auth
Si queremos que la ruta este autorizada por roles y permisos, ponemos role y la lista de roles
Ejemplo: router.get('/', auth, role(['admin', 'user']), recipesController.recipes);
ruta para admin o user. Esta claro que si uno es admin es user, o no? dependerá del problema
y si quremoes que puedan haber rutas de user que no acceda admin
o viceversa. Si no se pone es user(omitir poner middleware role) */

// GET Listar todos los elementos, podemos hacerlo todos. Si no se pone role es que esta implícito role(['user'])
router.get('/', recipesController.recipes);

// GET Obtiene un elemento por por ID, podemos hacerlo todos
router.get('/:id', recipesController.recipeById);

// POST Añadir Elemento. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.post('/', auth, role(['user']), recipesController.addRecipe);

// PUT Modifica un elemento por ID. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.put('/:id', auth, role(['user']), recipesController.editRecipeById);

// DELETE Elimina un elemento por ID. Solo autenticados y del nivel admin podrán, por eso no se pone nada (es por defecto)
router.delete('/:id', auth, role(['user']), recipesController.deleteRecipeById);

// GET Obtiene las recetas del usuario actual. autenticados, por eso nos e puede poner nada en role, es otra forma a parte de la otra
router.get('/me/list', auth, recipesController.myRecipes);

// PATCH Inserta la imagen en la receta
router.patch('/images/:id/insert', auth, recipesController.imageAddToRecipe);

// PATCH Elimina una imagen de las recetas una imagen en las recetas
router.patch('/images/:id/delete', auth, recipesController.imageDeleteToRecipe);

// Exprotamos el módulo
module.exports = router;
