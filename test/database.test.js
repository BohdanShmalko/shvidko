const db = require('../lib/database');
const httpMocks = require('node-mocks-http');

const dbConnectionMock = 'Your db connection';
const middlewareDB = db(dbConnectionMock);

describe('Test database', () => {
  test('database return middleware function', () => {
    expect(typeof middlewareDB).toBe('function');
  });

  test('check db in request', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    middlewareDB(req, res, () => {});
    expect(req.db).toEqual(dbConnectionMock);
  });
});
