// Fichero de middlewares a usar

// Librerías
const jwt = require ('jwt-simple');

// Funciones de auttenticación mediante JWT
// Cremos una función, esto es igual a function auth(req, res, next) {} 
// No autenicado es 401. una zona prohibida es 403

/**
 * Autenticación. Comprueba que el JWT es válido
* @param {*} req Request
* @param {*} res Response
* @param {*} next Next function
 */
const auth = (req, res, next) => {
    // Si la cabecera no tiene un token válido
    if (!req.headers.authorization) {
        return res
            .status(401)
            .send(
                {   
                    error: '401',
                    message: 'No Autenticado' 
                });
    }

    // Si tiene cabecera de autenticación descodificamos los token y payload.
    const token = req.headers.authorization.split(' ')[1];
    try {
        const payload = jwt.decode(token, req.app.locals.config.TOKEN_SECRET);
        // Recuperamos el usuario del payload
        req.user = payload;
        // Vamos a la siguiente ruta o función
        return next();
    // Si no casca es que ha expirado
    }catch(e){
        return res
            .status(401)
            .send(
                {   
                    error: '401',
                    message: 'La sesión ha caducado' 
                });
    }
};

/**
 * Autorizacion. Permitimos que pueda acceder
 * @param {*} role. Es una rray con los permisos, por si queremos tener varios y no mirar el menor de ellos
 */
const permit = (roles = ['normal']) => {
    // Devolvemos el middleware
    return (req, res, next) => {
        // Comprobamos que el rol del usuario existe en la lista de roles permitidos de una manera elegante :)
        const valid = req.user.role.some( role => roles.includes(role));
        if (valid) {
            next(); // role is allowed, so continue on the next middleware
        } else {
            // Si no tiene el rol...
            return res
                .status(403)
                .send(
                    {   
                        error: '403',
                        message: 'No Autorizado' 
                    });
        }
    }; 
};

/**
 * EXPORTACIÓN DE MODULOS, por que sigo el ecosistema de NODE
 */
module.exports = {
    auth, 
    permit
};