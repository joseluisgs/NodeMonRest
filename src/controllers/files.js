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
 */
const subirFichero = (file, req) => {
  let fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
  const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
  fileName = `${file.md5}.${fileExt}`; // this.getStorageName(file);
  // Creamos el objeto con los metadatos que quiero almacenar
  const newFile = File()({
    file: fileName,
    mimetype: file.mimetype,
    size: file.size,
    url: `${req.protocol}://${req.hostname}:${env.PORT}/${env.FILES_URL}/${fileName}`,
    username: req.user.username,
    type: 'file',
  });
  // Comprobamos que no existe. Primero consultamos
  const exists = File().getByFileName(fileName);
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
          return -99;
        }
        console.log(`Fichero subido con éxito a AWS `);
        // Almacenamos los datos en la base de datos y los metemos en el array de salida
        await newFile.save();
        // Borramos nuestro fichero del directorio files
        fs.unlinkSync(env.STORAGE + fileName);
        // Mandamos la respuesta
        return newFile;
      });
    });
  } else {
    return -98;
  }
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
          files.forEach(async (file) => {
            console.log('Muchos');
          });
        // Solo tenemos un fichero
        } else {
          const file = req.files.files;
          const up = subirFichero(file, req);
          console.log(up);
          if (up) {
            data.push(up);
            // Devolvemos las cosas
            res.send({
              status: true,
              message: 'Fichero(s) subido(s) con éxito',
              data,
            });
          } else {
            res.status(404).json({
              error: 404,
              mensaje: `Ya existe este fichero en el servidor`,
            });
          }
        }
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
      // Busco el fichero
      const fichero = await File().getById(req.params.id);
      fs.unlink(env.STORAGE + fichero.file, async (err) => {
        if (err) throw err;
        console.log('Fichero borrado');
        const data = await File().findByIdAndDelete({ _id: req.params.id });
        if (data) {
          res.status(200).json(data);
        } else {
          console.log('Hola');
          res.status(404).json({
            error: 404,
            mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
          });
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async uploadFile(req, res) {
    console.log('preparing to upload...');
    const file = req.files.files;
    const fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
    const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
    const fileDest = `${file.md5}.${fileExt}`; // this.getStorageName(file);
    file.mv(env.STORAGE + fileDest);

    const fileData = fs.readFileSync(env.STORAGE + fileDest);

    console.log(fileData);

    const putParams = {
      Bucket: 'nodemonrest',
      Key: fileDest,
      Body: fileData,
      // ACL: 'public-read',
    };


    s3.putObject(putParams, (err, data) => {
      if (err) {
        console.log('Could nor upload the file. Error :', err);
        return res.send({ success: false });
      }
      console.log(`File uploaded successfully at ${JSON.stringify(data)}`);
      // fs.unlink(file);// Deleting the file from uploads folder(Optional).Do Whatever you prefer.
      // console.log('Successfully uploaded the file');
      return res.send({ success: true });
    });


    fs.unlink(env.STORAGE + fileDest, async (err) => {
      if (err) throw err;
      console.log('Fichero borrado');
    });
  }

  // The retrieveFile function
  async retrieveFile(req, res) {
    console.log(req.params.file);
    const getParams = {
      Bucket: 'nodemonrest',
      Key: req.params.file,
    };

    s3.getObject(getParams, (err, data) => {
      if (err) {
        return res.status(400).send({ success: false, err });
      }

      return res.send(data.Body);
    });
  }


  // The retrieveFile function
  async removingFile(req, res) {
    console.log(req.params.file);
    const getParams = {
      Bucket: 'nodemonrest',
      Key: req.params.file,
    };

    s3.deleteObject(getParams, (err, data) => {
      if (err) {
        return res.status(400).send({ success: false, err });
      }

      return res.send(data.Body);
    });
  }
}

// Exportamos el módulo
module.exports = new FilesController();
