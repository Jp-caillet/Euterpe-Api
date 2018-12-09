// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../app/server.js');

// Core
const server = new Server();
const app = server.app;
const should = chai.should();

chai.use(chaiHttp);

/**
 * GET /user
 */
describe('GET /user', () => {
  it('POST /create should create an user', (done) => {
    const result = '{"1":{"name":"cyril","age":30,"gender":"male"},"2":{"name":"jp","age":24,"gender":"male"},"3":{"name":"guillaume","age":2,"gender":"male"},"4":{"name":"tutu","age":45,"gender":"male"}}';
    const payload = {'name': 'tutu','age': 45,'gender': 'male'};

    chai.request(app)
      .post('/user/create')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('POST /create should check the payload body is false', (done) => {
    const result = '{"errors":[{"parameter":"nme","value":"tutu","message":"Unexpected value."},{"parameter":"ag","value":40,"message":"Unexpected value."},{"parameter":"gende","value":"male","message":"Unexpected value."},{"parameter":"name","message":"Required value."}]}';
    const payload = {'nme': 'tutu','ag': 40,'gende': 'male'};

    chai.request(app)
      .post('/user/create')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('GET /show:id should not get an user by false id', (done) => {
    chai.request(app)
      .get('/user/show/12')
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('{}');

          done();
      });
  });

  it('GET /show:id should have not id in url', (done) => {
    chai.request(app)
      .get('/user/show/')
      .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eql('{"code":404,"message":"Not Found"}');

          done();
      });
  });

  it('GET /show:id should get an user result with id 1', (done) => {
    chai.request(app)
      .get('/user/show/1')
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('{"name":"cyril","age":30,"gender":"male"}');

          done();
      });
  });

  it('POST /search should search user 1 and 2', (done) => {
    const result = '{"1":{"name":"cyril","age":30,"gender":"male"},"3":{"name":"guillaume","age":2,"gender":"male"}}';
    const payload = {'ids': ['1', '3']};

    chai.request(app)
      .post('/user/search')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('POST /search should check the payload body is false', (done) => {
    const result = '{"errors":[{"parameter":"id","value":["1","3"],"message":"Unexpected value."},{"parameter":"ids","message":"Required value."}]}';
    const payload = {'id': ['1', '3']};

    chai.request(app)
      .post('/user/search')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('PUT /update should update user', (done) => {
    const result = '{"1":{"name":"Arnaud","age":30,"gender":"male"}}';
    const payload = {'name': 'Arnaud'};

    chai.request(app)
      .put('/user/update/1')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('DELETE /destroy/:id should delete an user', (done) => {
    const result = '{"2":{"name":"jp","age":24,"gender":"male"},"3":{"name":"guillaume","age":2,"gender":"male"},"4":{"name":"tutu","age":45,"gender":"male"}}';

    chai.request(app)
      .delete('/user/destroy/1')
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('DELETE /destroy/:id should have not id in url', (done) => {
    chai.request(app)
      .get('/user/destroy/')
      .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eql('{"code":404,"message":"Not Found"}');

          done();
      });
  });
});