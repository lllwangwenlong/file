var request = require('supertest');
var app = require('../app');

describe('POST /todos', function () {
  it('creates a todo and returns 201 with the created item', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '写文档', description: '完成待办事项的说明文档' })
      .set('Accept', 'application/json')
      .expect(201)
      .expect(function (res) {
        if (res.body.code !== 201) throw new Error('code should be 201');
        if (!res.body.data.id) throw new Error('data.id missing');
        if (res.body.data.name !== '写文档') throw new Error('name mismatch');
        if (res.body.data.description !== '完成待办事项的说明文档') throw new Error('description mismatch');
        if (!res.body.data.createdAt) throw new Error('createdAt missing');
      })
      .end(done);
  });

  it('returns 400 when name is empty', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '   ', description: '' })
      .set('Accept', 'application/json')
      .expect(400)
      .expect(function (res) {
        if (res.body.code !== 400) throw new Error('code should be 400');
        if (!res.body.message) throw new Error('message missing');
      })
      .end(done);
  });
});

describe('GET /todos', function () {
  it('returns all created todos', function (done) {
    request(app)
      .post('/todos')
      .send({ name: '买菜', description: '' })
      .set('Accept', 'application/json')
      .expect(201)
      .end(function () {
        request(app)
          .get('/todos')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(function (res) {
            if (res.body.code !== 200) throw new Error('code should be 200');
            if (!Array.isArray(res.body.data)) throw new Error('data should be an array');
            if (res.body.data.length === 0) throw new Error('data should not be empty');
          })
          .end(done);
      });
  });
});
