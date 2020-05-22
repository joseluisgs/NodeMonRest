// Fichero de middlewares a usar

// Librerías
const jwt = require('jwt-simple');
const env = require('../env');

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
    return res.status(401).send({
      error: '401',
      message: 'No Autenticado',
    });
  }

  // Si tiene cabecera de autenticación descodificamos los token y payload.
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = jwt.decode(token, env.TOKEN_SECRET);
    // Recuperamos el usuario del payload
    req.user = payload;
    // Vamos a la siguiente ruta o función
    return next();
    // Si no casca es que ha expirado
  } catch (e) {
    return res.status(401).send({
      error: '401',
      message: 'La sesión ha caducado',
    });
  }
};

/**
 * Autorizacion. Permitimos que pueda acceder dependiendo de na lista de roles. Por defecto tenemos el rol normal o user
 * @param {*} role. Es una rray con los permisos, por si queremos tener varios y no mirar el menor de ellos
 */
// eslint-disable-next-line consistent-return
const role = (roles = ['user']) => (req, res, next) => {
  // Devolvemos el middleware
  // Comprobamos que el rol del usuario existe en la lista de roles permitidos de una manera elegante :)
  const valid = req.user.roles.some((rol) => roles.includes(rol));
  if (valid) {
    next(); // role is allowed, so continue on the next middleware
  } else {
    // Si no tiene el rol...
    return res.status(403).send({
      error: '403',
      message: 'No Autorizado',
    });
  }
};

/**
 * EXPORTACIÓN DE MODULOS, por que sigo el ecosistema de NODE
 */
module.exports = {
  auth, // indica su está autenticado
  role, // lista de roles permitidos para pasar
};
