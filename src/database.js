/**
 * CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
 * Configuración principal de nuestro servidor
 */

// Librerías
const mongoose = require('mongoose');
const env = require('./env');

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
   * Se conecta a la conexión indicada. Se realiza por promesas, es decir, hasta que no se cumpla la promesa, espera el proceso del servidor
   */
  connect() {
    // Creamos una cadena de conexión según los parámetros de .env. Ojo que esta partida la línea
    const host = `${env.DB_PROTOCOL}://${env.DB_USER}:${env.DB_PASS}@${env.DB_URL}/${env.DB_NAME}?retryWrites=true&w=majority`;
    // Definimos una promesa que se resollverá si nos conecatmos correctamente
    return new Promise((resolve) => {
      // Configuramos el la conexión del cliente Mongo
      mongoose.set('debug', env.DB_DEBUG); // activamos  el modo depurador si así lo tenemos en nuestro fichero
      mongoose.set('useNewUrlParser', true);
      mongoose.set('useUnifiedTopology', true);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', true);
      mongoose.Promise = global.Promise;

      // Creamos la cenexión
      this.conn = mongoose.createConnection(host, {
        poolSize: env.DB_POOLSIZE,
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
