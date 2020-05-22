/**
 * MODELO EN BASE AL ESQUEMA DE TOKEN REFRESH
 * Modelo en base al esquema de token refres siguiendo la sitáxis de mongoose
 * https://mongoosejs.com/
 */


/**
 * Esquema de Usuarios
 */
const mongoose = require('mongoose');
const env = require('../env');
const db = require('../database');


// Creación del esquema
const TokenRefreshSchema = new mongoose.Schema(
  {
    // Le indicamos que expire
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: (env.TOKEN_REFRESH * 60) },
    },
    username: { type: String, required: true },
    uuid: { type: String, required: true },
  },
  // El método estriccto nos dice si aceptamos o no un documento incpleto. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
  { strict: false },
  // Le añadimos una huella de tiempo
  { timestamps: true },
);

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el Iusuario por ID
TokenRefreshSchema.statics.getById = function getById(id) {
  return this.findOne({ _id: id })
    .lean() // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
    .exec(); // Que lo ejecute
};

// Devuelve el Iusuario por Username
TokenRefreshSchema.statics.getByUserName = function getByUserName(username) {
  return this.findOne({ username })
    .lean()
    .exec();
};

// Devuleve el usuario por UUID
TokenRefreshSchema.statics.getByUUID = function getByUUID(uuid) {
  return this.findOne({ uuid })
    .lean()
    .exec();
};

// Sobre escribimos el método JSON, esto es porque si hacemos una vista necesitamos id y no _id que es como lo guarda Mongo
TokenRefreshSchema.method('toJSON', function toJSON() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Creamos un modelo del esquema
TokenRefreshSchema.TokenRefreshModel = () => db.connection().model('TokenRefresh', TokenRefreshSchema);

module.exports = TokenRefreshSchema;
