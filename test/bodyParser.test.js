const bp = require('../lib/bodyParser');
const httpMocks = require('node-mocks-http');

const testRout = {
  get: {
    '/main/get': (req, res) => res.end('get ok'),
  },
  post: {
    '/main/post': (req, res) => res.end('post ok'),
  },
};
const ifNotFound = 'page is not found';
const middlewareBP = bp(testRout, ifNotFound);

describe('Test bodyparser', () => {
  test('bodyParser return middleware function', () => {
    expect(typeof middlewareBP).toBe('function');
  });

  test('GET request - body is undefined', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/main/get',
    });
    const res = httpMocks.createResponse();

    middlewareBP(req, res, () => {});
    expect(req.body).toEqual({});
  });

  test('Post request with correct route', () => {
    const clientData = { id: 10, data: 'some data' };
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/main/post',
      body: clientData,
    });
    const res = httpMocks.createResponse();

    middlewareBP(req, res, () => {});
    expect(req.body).toBe(clientData);
  });

  test('Post request with incorrect route', () => {
    const clientData = { id: 10, data: 'some data' };
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/some/incorrect/route',
      body: clientData,
    });
    const res = httpMocks.createResponse();
    res.end = (data) => {
      res.result = data;
    };

    middlewareBP(req, res, () => {});
    expect(res.statusCode).toBe(404);
    expect(res.result).toBe(ifNotFound);
  });
});
