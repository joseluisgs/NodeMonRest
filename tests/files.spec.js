process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const fs = require('fs');
const { server } = require('../src');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
// const url = 'http://localhost:8000';

// Variables globales a utilizar entre las distintas pruebas
let token;
let idFichero;

/**
 * TEST: FILES
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Ficheros', () => {
  let instance;

  // antes de comenzar, levantamos el servidor
  // eslint-disable-next-line no-undef
  beforeEach(() => {
    instance = server.start();
  });

  // Al terminar lo cerramos
  // eslint-disable-next-line no-undef
  afterEach(() => {
    instance.close();
  });

  /**
   * TEST POST Login usuario admin
   */
  // eslint-disable-next-line no-undef
  describe('POST: Identificar un usuario para administrar ficheros: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario admin', (done) => {
      const user = {
        username: 'admin',
        email: 'admin@admin.com',
        password: '$2b$10$oN1K03f5kjqa23HGei5vZ.1OjB5frIw7vw8F0KuvT1LUobUMVLLIG',
      };
      chai.request(instance)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('refreshToken');
          token = res.body.token;
          done();
        });
    });
  });

  /**
   * TEST: GET ALL
   */
  // eslint-disable-next-line no-undef
  describe('GET: Obtener todos los ficheros: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todos los ficheros', (done) => {
      chai.request(instance)
        .get('/files/all')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
  * TEST: GET BY ID
  */
  // eslint-disable-next-line no-undef
  describe('GET: Obtener fichero por id', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener un fichero dado su id', (done) => {
      const id = '5eb689d323847c1afcff6daa';
      chai.request(instance)
        .get(`/files/file/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('file');
          res.body.should.have.property('url');
          res.body.should.have.property('mimetype');
          res.body.should.have.property('username');
          res.body.should.have.property('size');
          res.body.should.have.property('_id').eql(id);
          done();
        });
    });
  });

  /**
   * TEST: GET FICHEROS POR USUARIO IDENTIFICADO
   */
  // eslint-disable-next-line no-undef
  describe('GET: Obtiene ls ficheros del usuario registrado', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener la lista del usuario identificado', (done) => {
      chai.request(instance)
        .get('/files/me')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
   * TEST: POST SUBIDA DE FICHEROS
   */
  // eslint-disable-next-line no-undef
  describe('POST: Sube un fichero una lista de ficheros', () => {
    // eslint-disable-next-line no-undef
    it('Debería subir un(unos) fichero(s) al servidor', (done) => {
      chai.request(instance)
        .post('/files/upload')
        .set({ Authorization: `Bearer ${token}` })
        .attach('files', fs.readFileSync(`${__dirname}/test.png`), 'test.png')
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          idFichero = res.body.data[0].newFile.id;
          done();
        });
    });
  });

  /**
  * TEST DELETE Eliminar Fichero
  */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar Fichero: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería eliminar un fichero', (done) => {
      chai.request(instance)
        .delete(`/files/delete/${idFichero}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.should.have.property('id').eql(idFichero);
          done();
        });
    });
  });
});
