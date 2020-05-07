/**
 * MODELO EN BASE AL ESQUEMA DE TOKEN REFRESH
 * Modelo en base al esquema de token refres siguiendo la sitáxis de mongoose
 * https://mongoosejs.com/
 */

'use strict';

/**
 * Esquema de Usuarios
 */
const db = require ('../database');
const mongoose = require('mongoose');
const conf = require('dotenv');

// Cargamos la configuración del fichero .env
const SETTINGS = conf.config();


// Creación del esquema
const TokenRefreshSchema = new mongoose.Schema(
    {
        // Le indicamos que expire
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: (SETTINGS.parsed.TOKEN_REFRESH*1000) }  
        },
        username: { type: String, required: true },
        uuid: { type: String, required: true }
    },
    // El método estriccto nos dice si aceptamos o no un documento incpleto. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
    {strict: false},
    // Le añadimos una huella de tiempo
    {timestamps: true }
);

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el Iusuario por ID
TokenRefreshSchema.statics.getById = function (id) {
    return this.findOne({ _id: id })
        .lean()                             // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
        .exec();                            // Que lo ejecute
};

// Devuelve el Iusuario por Username
TokenRefreshSchema.statics.getByUserName = function (username) {
    return this.findOne({ username: username })
        .lean()                             
        .exec();                            
};

// Devuleve el usuario por UUID
TokenRefreshSchema.statics.getByUUID = function (uuid) {
    return this.findOne({ uuid: uuid })
        .lean()                            
        .exec();                            
};

// Sobre escribimos el método JSON, esto es porque si hacemos una vista necesitamos id y no _id que es como lo guarda Mongo
TokenRefreshSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

// Creamos un modelo del esquema
TokenRefreshSchema.TokenRefreshModel = () => db.connection().model('TokenRefresh', TokenRefreshSchema);

module.exports = TokenRefreshSchema;