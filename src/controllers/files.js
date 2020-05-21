/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE FICHEROS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */


// Librerias
const AWS = require('aws-sdk'); // Amazon AWS para almacenar en S3
const fs = require('fs');
const File = require('../models/files').FileModel;
const env = require('../env');

// Configuramos la conexión a AWS
AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});
// Creamos el objeto S3
const s3 = new AWS.S3();

/**
 * Sube un fichero al servidor, lo hago así porque lo vamos a repetir mucho esta función dependiendo si noos entran
 * Uno o varios ficheros
 * No necesitamos la URL si hago un método GET, porque nop van a ser accesibles desde AWS
 * @param {*} file fichero a subir
 * @param {*} type tipo del fichero: file, image, avatar, music, etc.
 * @param {*} username Usuario dueño del fichero
 */
const subirFichero = async (file, type, username) => {
  let fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
  const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
  fileName = `${file.md5}.${fileExt}`; // this.getStorageName(file);
  // Creamos el objeto con los metadatos que quiero almacenar
  const newFile = File()({
    file: fileName,
    mimetype: file.mimetype,
    size: file.size,
    // url: `${req.protocol}://${req.hostname}:${env.PORT}/${env.FILES_URL}/${fileName}`,
    username,
    type,
  });
  // Comprobamos que no existe. Primero consultamos
  const exists = await File().getByFileName(fileName);
  if (!exists) {
    // Lo movemos, esto es porque estamos usando el espacio temporal, si no nos podríamos ahorrar otros pasos.
    file.mv(env.STORAGE + fileName); // Lo movemos  mi directorio file. Porque uso espacio temporal
    // Lo leemos, esto es por el espacio tempral, si no no es necesario
    fs.readFile(env.STORAGE + fileName, async (err, fileData) => {
      // Creamos el objeto de subida S3
      const putParams = {
        Bucket: env.AWS_BUCKET, // Bucket de destino
        Key: fileName, // Nombre y clave del fichero
        Body: fileData, // Datos del fichero
        // ACL: 'public-read', // No queremos que sea público. El enlace lo generaré o para encapsular las cosas.
      };
      // Subimos
      s3.putObject(putParams, async (error) => {
        if (error) {
          throw Error(`Error de subioda a AWS: ${error}`);
        }
        console.log(`Fichero subido con éxito a AWS `);
        // Almacenamos los datos en la base de datos y los metemos en el array de salida
        await newFile.save();
        // Borramos nuestro fichero del directorio files
        fs.unlinkSync(env.STORAGE + fileName);
        // Mandamos la respuesta
      });
    });
  }
  // Si esta repetido o no, como ya está se lo mandamos pero nos ahorramos el proceso
  return newFile;
};

class FilesController {
  /**
   * POST. Añade una imagen al directorio file
   * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async addFiles(req, res) {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        res.send({
          status: 400,
          message: 'No hay fichero para subir',
        });
      } else {
        // debemos usar el mismo nombre que lleva en el formulario
        const data = [];
        const { files } = req.files;
        // Miramos si son varios ficheros
        const isFiles = Array.isArray(req.files.files);
        if (isFiles) {
          // eslint-disable-next-line no-restricted-syntax
          for (const file of files) {
            // eslint-disable-next-line no-await-in-loop
            const newFile = await subirFichero(file, 'file', req.user.username);
            console.log(newFile);
            data.push(newFile);
          }
        // Solo tenemos un fichero
        } else {
          let file = req.files.files;
          file = await subirFichero(file, 'file', req.user.username);
          data.push(file);
        }
        res.send({
          status: true,
          message: 'Fichero(s) subido(s) con éxito',
          files: data,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }


  /**
     * GET all. Devueleve una lista con todas los elementos del repositorio
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  async files(req, res) {
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
      const data = await File().getAll(pageOptions, searchOptions);
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
  async fileById(req, res) {
    try {
      const data = await File().getById(req.params.id);
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
     * GET por Nombre. Devuelve uneun elemento en base a su Nombre
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  async fileByName(req, res) {
    try {
      const data = await File().getByFileName(req.params.file);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese Nombre: ${req.params.file}`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
     * GET all. Devueleve una lista con todas los elementos del repositorio que pertenecen a dicho usuario
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  async myFiles(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: 'username', // Campo por defecto para la búsqueda
      search_content: req.user.username,
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await File().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
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
  async deleteFileById(req, res) {
    try {
      // Busco el fichero y lo borro
      let data = await File().getById(req.params.id);
      if (data) {
        // Primero lo hago en AWS S3
        const getParams = {
          Bucket: env.AWS_BUCKET,
          Key: data.file,
        };
        s3.deleteObject(getParams, async (err, file) => {
          if (err) {
            return res.status(400).send({ success: false, err });
          }
          data = await File().findByIdAndDelete({ _id: req.params.id });
          return res.status(200).send(file.Body);
        });
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
     * GET File. Devueleve el binario del fichero, es decir lo descargar de AWS y se lo manda al usuario para descargarlo o ponerlo en la web
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  async getFile(req, res) {
    // Aunque AWS S3 me devuelve el error si no existe, voy a hacerlo como el resto de las cosas.
    try {
      const data = await File().getByFileName(req.params.file);
      if (data) {
        // Construimos el objeto
        const getParams = {
          Bucket: env.AWS_BUCKET,
          Key: req.params.file,
        };
        s3.getObject(getParams, (err, file) => {
          if (err) {
            return res.status(400).send({ success: false, err });
          }
          return res.status(200).send(file.Body);
        });
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese Nombre: ${req.params.file}`,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}


// Exportamos el módulo
module.exports = new FilesController();
