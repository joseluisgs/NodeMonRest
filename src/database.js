/**
 * CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
 * Configuración principal de nuestro servidor
 */

// Librerías
const mongoose = require('mongoose');
const { config } = require('./config');

/**
 * configuración de conexión a la base de datos siguiendo un patrón singleton
 */
class Database {
  /**
   * Constructor
   */
  constructor() {
    this.conn = false;
  }

  /**
   * Devuelve el objeto de conexi`ó actual
   */
  connection() {
    return this.conn;
  }

  /**
   * Se conecta a la conexión indicada
   */
  connect() {
    // Creamos una cadena de conexión según los parámetros de .env. Ojo que esta partida la línea
    const host = `${config.DB_PROTOCOL}://${config.DB_USER}:${config.DB_PASS}@${config.DB_URL}/${config.DB_NAME}?retryWrites=true&w=majority`;
    // Definimos una promesa que se resollverá si nos conecatmos correctamente
    return new Promise((resolve) => {
      // Configuramos el la conexión del cliente Mongo
      mongoose.set('debug', config.DB_DEBUG); // activamos  el modo depurador si así lo tenemos en nuestro fichero
      mongoose.set('useNewUrlParser', true);
      mongoose.set('useUnifiedTopology', true);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', true);
      mongoose.Promise = global.Promise;

      // Creamos la cenexión
      this.conn = mongoose.createConnection(host, {
        poolSize: config.DB_POOLSIZE,
      });

      // Si hay un error, salimos de la apliación
      this.conn.on('error', (err) => {
        console.log('✕ Mongo Error', err);
        return process.exit();
      });

      // Si recibimos el evento conectamos
      this.conn.on('connected', () => {
        console.log('⚑ Conectado a Servidor Mongo ✓');
        resolve(); // Resolvemos la promesa
      });
    });
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Database();

// Devolvemos el módulo
module.exports = instance;
