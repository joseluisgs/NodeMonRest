process.env.NODE_ENV = 'test';

// Librerías
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

const should = chai.should();

chai.use(chaiHttp);
const url = 'http://localhost:8000';

/**
 * TEST: GET ALL
 */
// eslint-disable-next-line no-undef
describe('/GET/ recetas', () => {
// eslint-disable-next-line no-undef
  describe('Obtener todas las recetas: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todas las recetas', (done) => {
      chai.request(url)
        .get('/recipes')
        .end((err, res) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
  * TEST: GET BY ID
  */
  // eslint-disable-next-line no-undef
  describe('/GET/:id receta', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener una receta dado su id', (done) => {
      const id = '5eb5823faf05681681978e2d';
      chai.request(url)
        .get(`/recipes/${id}`)
        // .send(recipe)
        .end((err, res) => {
          console.log(res.body);
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

// Recetas
});
