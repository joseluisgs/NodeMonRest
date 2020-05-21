/**
 * CONFIGURACIÓN DE LOS DATOS Y VARIABLES DE ENTORno
 * Pueden llegar de un fichero .env, o desde el propio entorno de desarrollo
 */

// Librerías
const conf = require('dotenv');
// Cogemos el objeto que necesitamos .env
conf.config(); // Toda la configuración parseada del fichero .env

// Filtramos que estos parámetros importantes para la ejecución estén
const paramsBD = process.env.DB_USER && process.env.DB_PASS && process.env.DB_URL && process.env.DB_PORT && process.env.DB_NAME;
if (!paramsBD) {
  console.log('✕ Error: Faltán variables de entorno para la ejecución en MongoDB. Por favor revise su fichero .env');
  process.exit(22);
}
const paramsAWS = process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION && process.env.AWS_BUCKET;
if (!paramsAWS) {
  console.log('✕ Error: Faltán variables de entorno para la ejecución en Amazon AWS S3. Por favor revise su fichero .env');
  process.exit(22);
}

// Es importante que pongamos unos valores por defecto por si no están en el .env o defnidos en el sistema
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV || 'development',
  DEBUG: process.env.DEBUG || true,
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8000,
  TIMEZONE: process.env.TIMEZONE || 'Europe/Madrid',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Este_Caballo_Viene_de_Boanzarrrrr_/_Lorem_Fistrum_Pecador_Te_Va_A_Haser_Pupitaa_Diodenaaalll_2020',
  TOKEN_LIFE: process.env.TOKEN_LIFE || 20,
  TOKEN_REFRESH: process.env.TOKEN_REFRESH || 40,
  BC_SALT: process.env.BC_SALT || 10,
  DB_DEBUG: process.env.DB_DEBUG || '', // puede ser true
  DB_POOOLSIZE: process.env.DB_POOLSIZE || 200,
  DB_PROTOCOL: process.env.DB_PROTOCOL,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_URL: process.env.DB_URL,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  FILE_SIZE: process.env.FILE_SIZE || 2,
  FILES_PATH: process.env.FILES_PATH || 'files',
  FILES_URL: process.env.FILES_URL || 'files',
  STORAGE: `${__dirname}/public/${process.env.FILES_PATH}/`,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
};
