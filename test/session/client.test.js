const Client = require('../../lib/session/client');
const httpMocks = require('node-mocks-http');

describe('cookie client test', () => {
  test('parse cookies', () => {
    const rawCookies = 'cookie1=some1; cookie2=some2';
    const parseCookies = {
      cookie1: 'some1',
      cookie2: 'some2',
    };
    const req = httpMocks.createRequest({
      headers: { cookie: rawCookies },
    });
    const res = httpMocks.createResponse();
    const cookieClient = new Client(req, res, 10);
    cookieClient.parseCookie();
    expect(cookieClient.cookie).toEqual(parseCookies);
  });

  test('set cookies', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const cookieClient = new Client(req, res, 10);
    cookieClient.setCookie('token', 'some secret value');
    cookieClient.sendCookie();
    expect(res._headers['set-cookie']).toEqual([
      `token=some secret value; expires=${cookieClient.expires}; Path=/; Domain=no-host-name-in-http-headers`,
    ]);
  });

  test('delete cookie', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const cookieClient = new Client(req, res, 10);
    cookieClient.setCookie('token', 'some secret value');
    cookieClient.setCookie('temp', 'value that be deleted');
    cookieClient.deleteCookie('temp');
    cookieClient.sendCookie();
    expect(res._headers['set-cookie']).toEqual([
      `token=some secret value; expires=${cookieClient.expires}; Path=/; Domain=no-host-name-in-http-headers`,
      `temp=value that be deleted; expires=${cookieClient.expires}; Path=/; Domain=no-host-name-in-http-headers`,
      `temp=deleted; Expires=${new Date(
        0
      ).toUTCString()}; Path=/; Domain=no-host-name-in-http-headers`,
    ]);
  });
});
