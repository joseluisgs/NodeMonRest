process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const { server } = require('../src');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

// Variables globales para las pruebas
let token;
let refresh;


/**
 * TEST: AUTH
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Auth', () => {
  let instance;

  // antes de comenzar, levantamos el servidor, cambo befereEach por before para que se ejecute una vez en todo el test y no por cada test (prueba).
  // Es costoso arrancar y apagar el servidor
  // eslint-disable-next-line no-undef
  before(() => {
    instance = server.start();
  });

  // Al terminar lo cerramos. Cambio afterEach por after
  // eslint-disable-next-line no-undef
  after(() => {
    instance.close();
  });


  /**
   * TEST POST, Registrar usuario
   */
  // eslint-disable-next-line no-undef
  describe('POST: Registrar usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería registrar un usuario', (done) => {
      const user = {
        username: 'prueba2',
        email: 'prueba2@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
        roles: ['normal'],
        avatar: {
          url: 'https://api.adorable.io/avatars/200/prueba@prueba.png',
        },
      };
      chai.request(instance)
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
   * TEST POST Login correcto
   */
  // eslint-disable-next-line no-undef
  describe('POST: Identificar un usuario correcto: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario', (done) => {
      const user = {
        username: 'prueba2',
        email: 'prueba2@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
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
          refresh = res.body.refreshToken;
          done();
        });
    });
  });

  /**
  * TEST GET, Ver Datos de usuario
  */
  // eslint-disable-next-line no-undef
  describe('GET: Ver datos de usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería ver los datos del usuario', (done) => {
      chai.request(instance)
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
   * TEST PUT, Actualizar datos de usuario
   */
  // eslint-disable-next-line no-undef
  describe('PUT: Actualizar usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería actualizar un usuario', (done) => {
      const user = {
        username: 'prueba2',
        email: 'prueba2Mod@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
        roles: ['normal'],
        avatar: {
          url: 'https://api.adorable.io/avatars/200/prueba@prueba.png',
        },
      };
      chai.request(instance)
        .put('/auth/update')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('id');
          done();
        });
    });
  });

  /**
   * TEST DELETE, eliminar un usuario
   */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar mi usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería eliminar este usuario', (done) => {
      chai.request(instance)
        .delete('/auth/delete')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
   * TEST POST Login incorrecto
   */
  // eslint-disable-next-line no-undef
  describe('POST: No Identificar un usuario es incorrecto: ', () => {
    // eslint-disable-next-line no-undef
    it('No Debería autenticar al usuario', (done) => {
      const userWrong = {
        username: 'prueba',
        email: 'prueba@prueba.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsi1',
      };
      chai.request(instance)
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
   * TEST POST Login usuario Ana
   */
  // eslint-disable-next-line no-undef
  describe('POST: Identificar un usuario ana: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario', (done) => {
      const user = {
        username: 'ana',
        email: 'ana@correo.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
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
          refresh = res.body.refreshToken;
          done();
        });
    });
  });


  /**
   * TEST POST Refrescar Token
   */
  // eslint-disable-next-line no-undef
  describe('POST: Refrescar token: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería refrescar Token', (done) => {
      const user = {
        username: 'ana',
        email: 'ana@correo.com',
        role: '[\'normal\']',
        refreshToken: refresh,
      };
      chai.request(instance)
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
   * TEST POST, Cierra la sesión del usuario
   * Debe ser el último test
   */
  // eslint-disable-next-line no-undef
  describe('POST: Salir de sesión usuario: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería salir de la sesión', (done) => {
      const user = {
        username: 'ana',
        refreshToken: refresh,
      };
      chai.request(instance)
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
