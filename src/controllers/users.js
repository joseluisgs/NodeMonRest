/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE USUARIOS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */


// Librerias
// const AWS = require('aws-sdk'); // Amazon AWS para almacenar en S3
// const fs = require('fs');
const User = require('../models/users').UserModel;
const File = require('../models/files').FileModel;
// const env = require('../env');

// Configuramos la conexión a AWS
/* AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});
// Creamos el objeto S3
const s3 = new AWS.S3(); */

class UsersController {
  /**
   * GET all. Devueleve una lista con todas los elementos del repositorio
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async users(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: req.query.search_field || 'username', // Campo por defecto para la búsqueda
      search_content: req.query.search_content || '',
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await User().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * GET por id. Devuelve uneun elemento en base a su ID
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async userById(req, res) {
    try {
      const data = await User().getById(req.params.id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * POST. Añade un elemento al repositorio
   * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async addUser(req, res) {
    // Creamos el usuario
    const newUser = User()({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles,
      avatar: req.body.avatar,
    });
    try {
      const data = await newUser.save();
      res.status(201).json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * PUT por id. Modifica un elemento en base a su id
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async editUserById(req, res) {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles,
      avatar: req.body.avatar,
    };
    try {
      const data = await User().findOneAndUpdate(
        { _id: req.params.id },
        newUser,
      );
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Elimina un elemento en base a su ID.
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async deleteUserById(req, res) {
    try {
      const data = await User().findByIdAndDelete({ _id: req.params.id });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * PATCH por username. Modifica la imagen del usuario. Si no tiene la inserta, si tiene la borra y pone la nueva. Deveuleve el usuario actualizado
   * La imagen recoge su ide del body, antes la hemos tenido que subir al servidor o elegir una que exista
   * Códigos de estado: 201, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async avatarToUser(req, res) {
    try {
      // Me traigo los datos de mi usuario
      const user = await User().getByUserName(req.body.user);
      // Me traigo los datos del antiguo avatar
      // const oldAvatar = await File().getById(user.avatar._id);
      // Me traigo el nuevo fichero si lo he suubido
      const newAvatar = await File().getById(req.body.avatarID);
      if (user && newAvatar) {
        // Actualizo los metadatos del fichero y le digo que es un avatar
        /* let newData = {
                    type: 'avatar'
                }; */
        newAvatar.type = 'avatar';
        await File().findOneAndUpdate(
          { _id: req.body.avatarID },
          newAvatar,
        );
        // Le asignamos este nuevo avatar al usuario
        /* newData = {
                    avatar: newAvatar
                }; */
        user.avatar = newAvatar;
        await User().findOneAndUpdate({ _id: user._id }, user);
        // Borro la imagen antigua del fichero y de la Bd solo si existe y no son la misma
        // Esto es opcional, porque también podíamos hacer que el cliente borrara la imagen llamando a la llamada de la API de files
        // Posiblemente en versiones futuras desaparezca
        /* if (
          oldAvatar && oldAvatar._id.toString() !== newAvatar._id.toString()
        ) {
          // Primero la borro de Amazon y luego de Mongo, como en Files
          const getParams = {
            Bucket: env.AWS_BUCKET,
            Key: oldAvatar.file,
          };
          s3.deleteObject(getParams, async (err, file) => {
            if (err) {
              return res.status(400).send({ success: false, err });
            }
            data = await File().findByIdAndDelete({ _id: req.body.avatarID });
            return res.status(200).send(newAvatar);
          });
        } else {
          res.status(404).json({
            error: 404,
            mensaje: `No se ha encontrado un item con ese ID: ${req.body.avatarID}`,
          });
        } */
      }
      return res
        .status(200)
        .json({
          avatar: newAvatar,
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

// Exportamos el módulo
module.exports = new UsersController();
