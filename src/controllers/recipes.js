/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE RECETAS
 * Controlador de recetas para realizar los métodos que le indiquemos a través del enrutador.
 */


// Librerias
// const fs = require('fs');
const Recipe = require('../models/recipes').RecipeModel;
const File = require('../models/files').FileModel;
// const env = require('../env');

class RecipesController {
  /**
   * GET all. Devueleve una lista con todas los elementos del repositorio
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async recipes(req, res) {
    // Por si queremos paginar, añadiendo valores por defecto
    // console.log(req.user.username);
    // console.log(req.user.email);
    // console.log(req.user.role);

    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: req.query.search_field || 'title', // Campo por defecto para la búsqueda
      search_content: req.query.search_content || '',
      search_order: req.query.search_order || 'asc',
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
  async recipeById(req, res) {
    try {
      const data = await Recipe().getById(req.params.id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
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
  async addRecipe(req, res) {
    // Creamos la receta
    const newRecipe = Recipe()({
      title: req.body.title,
      description: req.body.description,
      persons: req.body.persons,
      time: req.body.time,
      ingredients: req.body.ingredients,
      difficulty: req.body.difficulty,
      username: req.user.username,
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
  async editRecipeById(req, res) {
    const newRecipe = {
      title: req.body.title,
      description: req.body.description,
      persons: req.body.persons,
      time: req.body.time,
      ingredients: req.body.ingredients,
      difficulty: req.body.difficulty,
      username: req.user.username,
    };
    try {
      const data = await Recipe().findOneAndUpdate({ _id: req.params.id }, newRecipe);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
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
  async deleteRecipeById(req, res) {
    try {
      const data = await Recipe().findByIdAndDelete({ _id: req.params.id });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
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
  async myRecipes(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: 'username', // Campo por defecto para la búsqueda
      search_content: req.user.username,
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await Recipe().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * PATCH por in de receta. Inserta un aimagen en una receta. Si no tiene la inserta, si tiene la borra y pone la nueva.
   * Deveuleve la receta actualizada
   * La imagen recoge su ide del body, antes la hemos tenido que subir al servidor o elegir una que exista
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async imageAddToRecipe(req, res) {
    try {
      // Me traigo de la receta
      const recipe = await Recipe().getById(req.params.id);
      // Me traigo el nuevo fichero si lo he suubido
      const newImage = await File().getById(req.body.imageID);
      if (recipe && newImage) {
        // Actualizo los metadatos del fichero
        newImage.type = 'recipe';
        // Si no está en el vector
        const exists = recipe.images.find((element) => element._id.toString() === newImage._id.toString());
        if (!exists) {
          // Le asignamos este nuevo avatar al usuario
          recipe.images.push(newImage);
          res.status(200).json(recipe);
        } else {
          res.status(200).json(recipe);
        }
      } else {
        return res.status(404).json({
          error: 404,
          mensaje: `No existe la receta o la imagen indicada`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * PATCH por username. Elimina una imagen de la receta y del disco. Devuelve la receta actualizada
   * La imagen recoge su ide del body, antes la hemos tenido que subir al servidor o elegir una que exista
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async imageDeleteToRecipe(req, res) {
    try {
      // Me traigo de la receta
      const recipe = await Recipe().getById(req.params.id);
      // Me traigo el fichero ha borrar.
      const image = await File().getById(req.body.imageID);
      if (recipe && image) {
        // Si esta en el vector
        const index = recipe.images.findIndex((element) => element._id.toString() === image._id.toString());
        if (index >= 0) {
          // La borramos
          recipe.images.splice(index, 1);
          await Recipe().findOneAndUpdate({ _id: recipe._id }, recipe);
          // Esto no lo voy a hacer porque no quiero borrarlas del fichero aquí. Será el cliente quien deba usar la api de ficheros y borrarla
          // Ahora la eliminamos de la BD y del fichero
          /* fs.unlink(env.STORAGE + image.file, async (err) => {
            if (err) throw err;
            console.log('Fichero borrado');
            data = await File().findByIdAndDelete({ _id: image._id });
            if (data) {
              res
                .status(200).json(recipe);
            } else {
              res.status(404).json({
                error: 404,
                mensaje: `No se ha encontrado un item con ese ID: ${req.body.imageID}`,
              });
            }
          });
          // res.status(200).json(recipe); */
        } else {
          res.status(200).json(recipe);
        }
      } else {
        return res.status(404).json({
          error: 404,
          mensaje: `No existe la receta o la imagen indicada`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

// Exportamos el módulo
module.exports = new RecipesController();
