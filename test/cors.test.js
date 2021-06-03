const cors = require('../lib/cors');
const httpMocks = require('node-mocks-http');

const serverCors = {
  'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'access-control-allow-origin': '*',
};
const middlewareCors = cors(serverCors);

describe('Test cors', () => {
  test('coors return middleware function', () => {
    expect(typeof middlewareCors).toBe('function');
  });

  test('check headers for cors', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    middlewareCors(req, res, () => {});
    expect(res._headers).toEqual(serverCors);
  });
});
