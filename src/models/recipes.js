/**
 * MODELO EN BASE AL ESQUEMA DE RECETAS
 * Modelo en base al esquema de recetas siguiendo la sitáxis de mongose
 * https://mongoosejs.com/
 */

'use strict';

/**
 * Esquema de Recetas
 */
const db = require ('../database');
const mongoose = require('mongoose');


// Creación del esquema
const RecipeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        ingredients: { type: Array, trim: true, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, required: true },
        persons: { type: Number, required: true },
        time: { type: Number, required: true }
    },
    // El método estriccto nos dice si aceptamos o no un documento incpleto. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
    {strict: false},
    // Le añadimos una huella de tiempo
    {timestamps: true }
);

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el ID
RecipeSchema.statics.getById = function (id) {
    return this.findOne({ _id: id })
        .lean()                             // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
        .exec();                            // Que lo ejecute
};

// Devuelve una lista de todos
RecipeSchema.statics.getAll = function (pageOptions, searchOptions) {   
    // Si no quieres buscar por nada, deja la función fin vacía, sin where ni equals
    return this.find()
        .where(searchOptions.search_field)
        .equals({$regex: searchOptions.search_content, $options: 'i'})
        .skip(pageOptions.page * pageOptions.limit) // si no quieres filtrar o paginar no pongas skip o limit
        .limit(pageOptions.limit)
        .sort({ title: searchOptions.search_order })
        .exec();
}; 

// Sobre escribimos el método JSON, esto es porque si hacemos una vista necesitamos id y no _id que es como lo guarda Mongo
RecipeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

// Creamos un modelo del esquema
RecipeSchema.RecipeModel = () => db.connection().model('Recipe', RecipeSchema);

module.exports = RecipeSchema;