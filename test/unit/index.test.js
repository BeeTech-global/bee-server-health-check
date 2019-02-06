const request = require('supertest');
const Koa = require('koa');
const router = require('koa-route');
const healthCheck = require('../../src');

describe('Bee Health Check', () => {
  beforeEach(() => {
    this.app = new Koa();
    this.app.use(router.get('/health-check', healthCheck()));

    this.server = this.app.listen();
  });

  afterEach(() => {
    this.server.close();
  });

  it('Should response with 200', () => request(this.server)
    .get('/health-check')
    .expect(200));

  it('Should response success with a given status code', () => {
    this.app.use(router.get('/health-check/202', healthCheck({ successStatusCode: 202 })));

    return request(this.server)
      .get('/health-check/202')
      .expect(202);
  });

  it('Should response failure with a given status code', () => {
    const healthFn = () => Promise.reject();

    this.app.use(router.get('/health-check/501', healthCheck({ healthFn, failureStatusCode: 501 })));

    return request(this.server)
      .get('/health-check/501')
      .expect(501);
  });

  it('Should response success with a given health function', () => {
    const response = {
      foo: 'bar'
    };

    const healthFn = () => Promise.resolve(response);

    this.app.use(router.get('/health-check/fn', healthCheck({ healthFn })));

    return request(this.server)
      .get('/health-check/fn')
      .expect(200)
      .expect(response);
  });

  it('Should response failure with a given health function', () => {
    const response = {
      foo: 'bar'
    };

    const healthFn = () => Promise.reject(response);

    this.app.use(router.get('/health-check/fnf', healthCheck({ healthFn })));

    return request(this.server)
      .get('/health-check/fnf')
      .expect(503)
      .expect(response);
  });
});
