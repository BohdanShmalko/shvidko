const cs = require('../lib/cookieSession');
const httpMocks = require('node-mocks-http');

const middlewareCS = cs(200, './', null);

describe('Test cookieSession', () => {
  test('cookieSession return middleware function', () => {
    expect(typeof middlewareCS).toBe('function');
  });

  test('cookieSession middleware is work', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    middlewareCS(req, res, () => {});
  });
});
