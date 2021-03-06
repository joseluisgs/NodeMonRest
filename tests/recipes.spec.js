process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const { server } = require('../src');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

// Variables globales para todas las pruebas
let token;
let idReceta;
const imageID = '5ec78d108e01e20bb2c59841'; // ID de La imagen que vamos a usar de prueba

/**
 * TEST: RECIPES
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Recetas', () => {
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
   * TEST: GET ALL
   */
  // eslint-disable-next-line no-undef
  describe('GET: Obtener todas las recetas: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todas las recetas', (done) => {
      chai.request(instance)
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
      chai.request(instance)
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
      chai.request(instance)
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
      chai.request(instance)
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
   * TEST PATCH, inserta una imagen en una receta
   */
  // eslint-disable-next-line no-undef
  describe('PATCH: Inserta una imagen en una receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería debería insertar una imagen en una receta', (done) => {
      const image = {
        imageID,
      };
      chai.request(instance)
        .patch(`/recipes/images/${idReceta}/insert`)
        .set({ Authorization: `Bearer ${token}` })
        .send(image)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('username');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('images');
          // res.body.should.have.property('_id').eql(idReceta);
          done();
        });
    });
  });

  /**
   * TEST PATCH, elimina una imagen en una receta
   */
  // eslint-disable-next-line no-undef
  describe('PATCH: Elimina una imagen en una receta: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería debería eliminar una imagen en una receta', (done) => {
      const image = {
        imageID,
      };
      chai.request(instance)
        .patch(`/recipes/images/${idReceta}/delete`)
        .set({ Authorization: `Bearer ${token}` })
        .send(image)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('username');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('images');
          // res.body.should.have.property('_id').eql(idReceta);
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
      chai.request(instance)
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
