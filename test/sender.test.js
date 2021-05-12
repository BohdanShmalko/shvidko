const sender = require('../lib/sender');
const httpMocks = require('node-mocks-http');

const middlewareSender = sender();

describe('Test sender', () => {
  test('sender is middleware function', () => {
    expect(typeof middlewareSender).toBe('function');
  });

  test('sender return string', () => {
    const testString = 'test string';
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.end = (data) => {
      res.result = data;
    };
    middlewareSender(req, res, () => {});
    res.send(testString);
    expect(res.result).toBe(testString);
  });

  test('sender return status code', () => {
    const statusCode = 202;
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    middlewareSender(req, res, () => {});
    res.send('some text', statusCode);
    expect(res.statusCode).toBe(statusCode);
  });

  test('sender return headers', () => {
    const testString = 'test string';
    const statusCode = 202;
    const headers = {
      'content-type': 'text/plain',
      'content-length': testString.length,
    };
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    middlewareSender(req, res, () => {});
    res.send('some text', statusCode, headers);
    expect(res._headers).toEqual(headers);
  });

  test('sender return object in JSON format', () => {
    const testObject = {
      id : 10,
      data : 'some data'
    };
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.end = (data) => {
      res.result = data;
    };
    middlewareSender(req, res, () => {});
    res.send(testObject);
    expect(res.result).toBe(JSON.stringify(testObject));
  });
});
