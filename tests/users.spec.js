process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const url = 'http://localhost:8000';

// Variables globales a utilizar entre las distintas pruebas
let token;
let idUsuario;

/**
 * TEST: USERS
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Usuarios', () => {
  /**
   * TEST POST Login usuario admin
   */
  // eslint-disable-next-line no-undef
  describe('POST: Identificar un usuario para administrar usuarios: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario admin', (done) => {
      const user = {
        username: 'admin',
        email: 'admin@admin.com',
        password: '$2b$10$oN1K03f5kjqa23HGei5vZ.1OjB5frIw7vw8F0KuvT1LUobUMVLLIG',
      };
      chai.request(url)
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
  describe('GET: Obtener todos los usuarios: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todas los usuarios', (done) => {
      chai.request(url)
        .get('/users')
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
  describe('GET: Obtener usuario por id', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener una usuario dado su id', (done) => {
      const id = '5eb2c6f3ccdfc8286c2bfd23';
      chai.request(url)
        .get(`/users/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('roles');
          res.body.should.have.property('_id').eql(id);
          done();
        });
    });
  });

  /**
   * TEST POST Añadir Usuario
   */
  // eslint-disable-next-line no-undef
  describe('POST: Añadir un usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería añadir un usuario', (done) => {
      const user = {
        username: 'prueba3',
        email: 'prueba3@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
        roles: ['normal'],
        avatar: {
          url: 'https://api.adorable.io/avatars/200/prueba@prueba.png',
        },
      };
      chai.request(url)
        .post('/users')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('id');
          idUsuario = res.body.id;
          done();
        });
    });
  });

  /**
   * TEST PUT Modificar usuario
   */
  // eslint-disable-next-line no-undef
  describe('PUT: Modificar Usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería modificar un usuario', (done) => {
      const user = {
        username: 'prueba2',
        email: 'prueba2Mod@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
        roles: ['normal'],
        avatar: {
          url: 'https://api.adorable.io/avatars/200/prueba@prueba.png',
        },
      };
      chai.request(url)
        .put(`/users/${idUsuario}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('id');
          res.body.should.have.property('id').eql(idUsuario);
          done();
        });
    });
  });

  /**
  * TEST DELETE Eliminar Usuario
  */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar Usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería eliminar un usuario', (done) => {
      chai.request(url)
        .delete(`/users/${idUsuario}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('id');
          res.body.should.have.property('id').eql(idUsuario);
          done();
        });
    });
  });
});