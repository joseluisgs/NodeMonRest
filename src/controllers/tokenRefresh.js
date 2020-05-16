/**
 * CONTROLADOR DE TOKEN REFRESH
 * Controlador de token refresh.
 */


// Librerías
const TokenRefresh = require('../models/tokenRefresh').TokenRefreshModel;

class TokenRefreshController {
  /**
   * Salva un Token Refresh en la BD
   * @param {*} username
   * @param {*} uuid
   */
  async save(username, uuid) {
    const newTokenRefresh = TokenRefresh()({
      username: username,
      uuid: uuid,
    });

    // Antes de insertar voy a borrar si ya este usuario esta en la BD
    await TokenRefresh().deleteMany({ username: username });
    return await newTokenRefresh.save();
  }

  /**
   * Devuelve un token de la BD por su ID
   * @param {*} uuid
   */
  async findByUUID(uuid) {
    return await TokenRefresh().getByUUID(uuid);
  }

  /**
   * Elimina un token refresh en base a su uuid
   * @param {*} uuid
   */
  async deleteByUUID(uuid) {
    return await TokenRefresh().deleteMany({ uuid: uuid });
  }
}

// Exportamos el módulo
module.exports = new TokenRefreshController();
