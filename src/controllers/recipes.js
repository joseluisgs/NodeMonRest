/**
 * CONTROLADOR DE RECETAS
 * Controlador de recetas para realizar los métodos que le indiquemos a través del enrutador.
 */

'use strict';

// Librerias
const Recipe  = require ('../models/recipes').RecipeModel;

class RecipesController {
    /**
     * GET all. Devueleve una lista con todas los elementos del repositorio
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async recipes (req, res, next) {
        // Por si queremos paginar, añadiendo valores por defecto
        //console.log(req.user.username);
        //console.log(req.user.email);
        //console.log(req.user.role);

        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0, 
            limit: parseInt(req.query.limit, 10) || 10
        };
        // Por si queremos buscar por un campo
        const searchOptions = {
            search_field: req.query.search_field || 'title', // Campo por defecto para la búsqueda
            search_content: req.query.search_content || '',
            search_order: req.query.search_order || 'asc'
        };

        try {
            const data = await Recipe().getAll(pageOptions, searchOptions);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }
    
    /**
     * GET por id. Devuelve uneun elemento en base a su ID
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async recipeById (req, res, next) {
        try {
            const data = await Recipe().getById(req.params.id);
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese ID: ${req.params.id}`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * POST. Añade un elemento al repositorio
     * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async addRecipe (req, res, next) {
        // Creamos la receta
        const newRecipe = Recipe()({
            title: req.body.title,
            description: req.body.description,
            persons: req.body.persons,
            time: req.body.time,
            ingredients: req.body.ingredients,
            difficulty: req.body.difficulty
        });
        try {
            const data = await newRecipe.save();
            res.status(201).json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * PUT por id. Modifica un elemento en base a su id
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async editRecipeById(req, res, next) {
        const newRecipe = {
            title: req.body.title,
            description: req.body.description,
            persons: req.body.persons,
            time: req.body.time,
            ingredients: req.body.ingredients,
            difficulty: req.body.difficulty
        };
        try {
            const data = await Recipe().findOneAndUpdate({ _id: req.params.id },newRecipe);
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese ID: ${req.params.id}`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * Elimina un elemento en base a su ID. 
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async deleteRecipeById(req, res, next) {
        try {
            const data = await Recipe().findByIdAndDelete({ _id: req.params.id });
            if (data) {
                res.status(200).json(data);
            } else { 
                res.status(404).json({
                    'error':404,
                    'mensaje': `No se ha encontrado un item con ese ID: ${req.params.id}`
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    /**
     * GET all. Devueleve una lista con todas los elementos del repositorio que pertenecen a dicho usuario
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
    async myRecipes (req, res, next) {
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0, 
            limit: parseInt(req.query.limit, 10) || 10
        };
        // Por si queremos buscar por un campo
        const searchOptions = {
            search_field: 'username', // Campo por defecto para la búsqueda
            search_content: req.user.username,
            search_order: req.query.search_order || 'asc'
        };

        try {
            const data = await Recipe().getAll(pageOptions, searchOptions);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

// Exportamos el módulo
module.exports = new RecipesController();