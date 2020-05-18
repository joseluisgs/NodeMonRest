/**
 * CONFIGURACIÓN DE LOS DATOS Y VARIABLES DE ENTORno
 * Pueden llegar de un fichero .env, o desde el propio entorno de desarrollo
 */

// Librerías
const conf = require('dotenv'); // Cogemos el objeto que necesitamos .env
const config = conf.config(); // Toda la configuración parseada del fichero .env

module.exports = {
  ENV: process.env.ENV,
  DEBUG: process.env.DEBUG,
  HODT: process.env.HOST,
  PORT: process.env.PORT,
  TIMEZONE: process.env.TIMEZONE,
  TOKEN: process.env.TOKEN_SECRET,
  TOKEN_LIFE: process.env.TOKEN_LIFE,
  TOKEN_REFESH: process.env.TOKEN_REFRESH,
  BC_SALT: process.env.BC_SALT,
  DB_DEBUG: process.envDB_DEBUG,
  DB_POOOLSIZE: process.env.DB_POOLSIZE,
  DB_PROTOCOL: process.env.DB_PROTOCOL,
  DB_SER: process.env.UDB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_URL: process.env.DB_URL,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  FILE_SIZE: process.env.FILE_SIZE,
  FILES_PATH: process.env.FILES_PATH,
  FILES_URL: process.env.FILES_URL,
  STORAGE: `${__dirname}/public/${process.env.FILES_PATH}/`,
};
