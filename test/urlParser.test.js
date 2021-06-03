const up = require('../lib/urlParser');
const httpMocks = require('node-mocks-http');

const testRout = {
  get: {
    '/main/get': (req, res) => res.end('get ok'),
    '/main/?param1;param2': (req, res) => res.end('get ok'),
  },
};
const ifNotFound = 'page is not found';
const middlewareUP = up(testRout, ifNotFound);

describe('Test url parser', () => {
  test('urlParser return middleware function', () => {
    expect(typeof middlewareUP).toBe('function');
  });

  test('simple GET request', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/main/get',
    });
    const res = httpMocks.createResponse();

    middlewareUP(req, res, () => {});
    expect(res.statusCode).toBe(200);
  });

  test('GET with params', () => {
    const param1 = 'some1';
    const param2 = 'some2';
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/main/?param1=${param1};param2=${param2}`,
    });
    const res = httpMocks.createResponse();

    middlewareUP(req, res, () => {});
    expect(req.params.param1).toBe(param1);
    expect(req.params.param2).toBe(param2);
  });

  test('GET request with incorrect route', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/some/incorrect/route',
    });
    const res = httpMocks.createResponse();
    res.end = (data) => {
      res.result = data;
    };

    middlewareUP(req, res, () => {});
    expect(res.statusCode).toBe(404);
    expect(res.result).toBe(ifNotFound);
  });
});
