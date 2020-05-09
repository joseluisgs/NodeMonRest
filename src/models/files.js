/**
 * MODELO EN BASE AL ESQUEMA DE FICHEROS
 * Modelo en base al esquema de ficheros siguiendo la sitáxis de mongose
 * https://mongoosejs.com/
 */

'use strict';

/**
 * Esquema de Recetas
 */
const db = require ('../database');
const mongoose = require('mongoose');


// Creación del esquema
const FileSchema = new mongoose.Schema(
    {
        file: { type: String, required: true, unique: true,  index: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
        url: { type: String, required: true, Default: 'https://picsum.photos/300/300'},
        username: { type: String, required: true },
        type: { type: String, required: true, Defaul: 'document'}
    },
    // El método estriccto nos dice si aceptamos o no un documento incpleto. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
    {strict: false},
    // Le añadimos una huella de tiempo
    {timestamps: true }
);

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el ID
FileSchema.statics.getById = function (id) {
    return this.findOne({ _id: id })
        .lean()                             // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
        .exec();                            // Que lo ejecute
};

// Devuelve una lista de todos con opciones de paginación
FileSchema.statics.getAll = function (pageOptions, searchOptions) {   
    // Si no quieres buscar por nada, deja la función fin vacía, sin where ni equals
    return this.find()
        .where(searchOptions.search_field)
        .equals({$regex: searchOptions.search_content, $options: 'i'})
        .skip(pageOptions.page * pageOptions.limit) // si no quieres filtrar o paginar no pongas skip o limit
        .limit(pageOptions.limit)
        .sort({ title: searchOptions.search_order })
        .exec();
}; 

// Devuelve el fichero por fichero
FileSchema.statics.getByFileName = function (file) {
    return this.findOne({ file: file })
        .lean()                             
        .exec();                            
};

// Devuelve el fichero de tipo avatar del usuario en cuestión
FileSchema.statics.getUserAvatar = function (username) {
    return this.findOne({ username: username, type: 'avatar' })
        .lean()                             
        .exec(); 
};

// Sobre escribimos el método JSON, esto es porque si hacemos una vista necesitamos id y no _id que es como lo guarda Mongo
FileSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

// Creamos un modelo del esquema
FileSchema.FileModel = () => db.connection().model('File', FileSchema);

module.exports = FileSchema;
