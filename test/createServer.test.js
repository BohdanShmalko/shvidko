const createServerTest = require('../lib/createServer');

describe('test create server', () => {
  test('check rout', () => {
    const server = createServerTest();
    server.get('/some/get1', () => {});
    server.get('/some/get2', () => {});
    server.put('/some/put1', () => {});
    server.put('/some/put2', () => {});
    server.delete('/some/delete1', () => {});
    server.delete('/some/delete2', () => {});
    server.post('/some/post1', () => {});
    server.post('/some/post2', () => {});

    expect(Object.keys(server.routing.get)).toEqual([
      '/some/get1',
      '/some/get2',
    ]);
    expect(Object.keys(server.routing.put)).toEqual([
      '/some/put1',
      '/some/put2',
    ]);
    expect(Object.keys(server.routing.delete)).toEqual([
      '/some/delete1',
      '/some/delete2',
    ]);
    expect(Object.keys(server.routing.post)).toEqual([
      '/some/post1',
      '/some/post2',
    ]);
  });

  test('check middlewares', () => {
    const server = createServerTest();
    server.use((req, res, next) => {});
    server.use((req, res, next) => {});

    expect(server.middlewares.length).toBe(2);
  });

  test('check subrouts', () => {
    const sbr1 = '/sbr1';
    const sbr2 = '/sbr2';
    const server = createServerTest();
    server.subroute(sbr1);
    server.subroute(sbr2);

    expect(server.childrens[sbr1]).not.toBeUndefined();
    expect(server.childrens[sbr2]).not.toBeUndefined();
    expect(server.childrens['/some/bad/subroute']).toBeUndefined();
  });
});
