/**
* CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
* Configuración principal de nuestro servidor
*/

'use strict';

// Librerías
const mongoose = require ('mongoose');
const conf = require('dotenv');


// Cargamos la configuración del fichero .env
const SETTINGS = conf.config();

/**
 * configuración de conexión a la base de datos siguiendo un patrón singleton
 */
class Database {
    /**
     * Constructor
     */
    constructor () {
        this.conn = false;
    }

    /**
     * Devuelve el objeto de conexi`ó actual
     */
    connection () {
        return this.conn;
    }

    /**
     * Se conecta a la conexión indicada
     */
    connect () {
        // Creamos una cadena de conexión según los parámetros de .env
        const host = `${SETTINGS.parsed.DB_PROTOCOL}://${SETTINGS.parsed.DB_USER}:${SETTINGS.parsed.DB_PASS}@${SETTINGS.parsed.DB_URL}/${SETTINGS.parsed.DB_NAME}?retryWrites=true&w=majority`;
        // Definimos una promesa que se resollverá si nos conecatmos correctamente
        return new Promise(resolve => {
            // Configuramos el lciente de mongo
            mongoose.set('debug', SETTINGS.parsed.DB_DEBUG);    // activamos  el modo depurador si así lo tenemos en nuestro fichero
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useUnifiedTopology', true);
            mongoose.Promise = global.Promise;

            // Creamos la cenexión
            this.conn = mongoose.createConnection(
                host,
                { poolSize: SETTINGS.parsed.DB_POOLSIZE }
            );
            
            // Si hay un error, salimos de la apliación
            this.conn.on('error', err => {
                console.log('✕ Mongo Error', err);
                return process.exit();
            });

            // Si recibimos el evento conectamos
            this.conn.on('connected', () => {
                console.log('⚑ Conectado a Servidor Mongo ✓');
                resolve();  // Resolvemos la promesa
            });
        });
    }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Database();


//Devolvemos el módulo
module.exports = instance;
