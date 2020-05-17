process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const url = 'http://localhost:8000';

// Variables globales para todas las pruebas
let token;
let idReceta;


/**
 * TEST: RECIPES
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Recetas', () => {
  /**
   * TEST: GET ALL
   */
  // eslint-disable-next-line no-undef
  describe('GET: Obtener todas las recetas: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todas las recetas', (done) => {
      chai.request(url)
        .get('/recipes')
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
  describe('GET: Obtiener recetas por id', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener una receta dado su id', (done) => {
      const id = '5eb5823faf05681681978e2d';
      chai.request(url)
        .get(`/recipes/${id}`)
        // .send(recipe)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('difficulty');
          res.body.should.have.property('persons');
          res.body.should.have.property('time');
          res.body.should.have.property('username');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('_id').eql(id);
          done();
        });
    });
  });

  /**
   * TEST POST Login usuario Ana
   */
  // eslint-disable-next-line no-undef
  describe('POST: Identificar un usuario para receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario', (done) => {
      const user = {
        username: 'ana',
        email: 'ana@correo.com',
        password: '$2b$10$/50h.TN1N9Wn.fJURZopHeVl4pNPfK33HGy3ejO.mFwt22BoWDsiO',
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
   * TEST POST Añadir Receta
   */
  // eslint-disable-next-line no-undef
  describe('POST: Añadir una receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería añadir una receta', (done) => {
      const recipe = {
        ingredients: [
          'ingrediente 1',
          'ingrediente 2',
        ],
        title: 'Receta Prueba',
        description: 'Receta de Prueba',
        difficulty: 'medium',
        persons: 3,
        time: 33,
      };
      chai.request(url)
        .post('/recipes')
        .set({ Authorization: `Bearer ${token}` })
        .send(recipe)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('username');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('difficulty');
          idReceta = res.body.id;
          done();
        });
    });
  });

  /**
   * TEST PUT Modificar receta
   */
  // eslint-disable-next-line no-undef
  describe('PUT: Modificar Receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería modificar una receta', (done) => {
      const recipe = {
        ingredients: [
          'ingrediente Mod',
          'ingrediente Mod',
        ],
        title: 'Receta Prueba Mod',
        description: 'Receta de Prueba Mod',
        difficulty: 'medium',
        persons: 3,
        time: 33,
      };
      chai.request(url)
        .put(`/recipes/${idReceta}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(recipe)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('username');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('difficulty');
          res.body.should.have.property('id').eql(idReceta);
          done();
        });
    });
  });

  /**
   * TEST DELETE Eliminar Receta
   */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar una receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería eliminar una receta', (done) => {
      chai.request(url)
        .delete(`/recipes/${idReceta}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('username');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('difficulty');
          res.body.should.have.property('id').eql(idReceta);
          done();
        });
    });
  });
// Recetas
});
