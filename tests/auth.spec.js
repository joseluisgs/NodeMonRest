process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const url = 'http://localhost:8000';

// Token de prueba
let token; // = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlcyI6WyJhZG1pbiIsIm5vcm1hbCJdLCJpYXQiOjE1ODk3MTQyNzUsImV4cCI6MTU4OTcxNzg3NX0.JDN8ewnP0lZWiuJ6XIb5yNezM4CkOOU-tmTOXQMTxb';
let refresh; // = '51100f2c-3cef-4161-b883-c87da9891db';


/**
 * TEST: AUTH
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Auth', () => {
  /**
   * TEST POST Login correcto
   */
  // eslint-disable-next-line no-undef
  describe('Identificar un usuario correcto: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario', (done) => {
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
          refresh = res.body.refreshToken;
          done();
        });
    });
  });

  /**
   * TEST POST Login incorrecto
   */
  // eslint-disable-next-line no-undef
  describe('No Identificar un usuario es incorrecto: ', () => {
    // eslint-disable-next-line no-undef
    it('No Debería autenticar al usuario', (done) => {
      const userWrong = {
        username: 'admin',
        email: 'admin@admin.com',
        password: '$2b$10$oN1K03f5kjqa23HGei5vZ.1OjB5frIw7vw8F0KuvT1LUobUMVLLI',
      };
      chai.request(url)
        .post('/auth/login')
        .send(userWrong)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });

  /**
   * TEST POST Refrescar Token
   */
  // eslint-disable-next-line no-undef
  describe('Refrescar token: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería refrescar Token', (done) => {
      const user = {
        username: 'admin',
        email: 'admin@admin.com',
        role: '[\'admin\', \'normal\']',
        refreshToken: refresh,
      };
      chai.request(url)
        .post('/auth/token')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('refreshToken');
          token = res.body.token;
          refresh = res.body.refreshToken;
          done();
        });
    });
  });

  /**
   * TEST GET, Ver Datos de usuario
   */
  // eslint-disable-next-line no-undef
  describe('Ver datos de usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería ver los datos del usuario', (done) => {
      chai.request(url)
        .get('/auth/me')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('roles');
          done();
        });
    });
  });

  /**
   * TEST POST, Registrar usuario
   */
  // eslint-disable-next-line no-undef
  describe('Registrar usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería registrar un usuario', (done) => {
      const user = {
        username: 'prueba',
        email: 'prueba@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
        roles: ['normal'],
        avatar: {
          url: 'https://api.adorable.io/avatars/200/prueba@prueba.png',
        },
      };
      chai.request(url)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('id');
          done();
        });
    });
  });

  /**
   * TEST POST, Cierra la sesión del usuario
   * Debe ser el último test
   */
  // eslint-disable-next-line no-undef
  describe('Salir de sesión usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería salir de la sesión', (done) => {
      const user = {
        username: 'admin',
        refreshToken: refresh,
      };
      chai.request(url)
        .post('/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(204);
          done();
        });
    });
  });

// Auth
});

