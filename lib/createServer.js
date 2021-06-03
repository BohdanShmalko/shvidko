const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./loger');

const recursiveMiddleware = (
  req,
  res,
  middlewares,
  routing,
  callback,
  index = 0
) => {
  index++;
  if (index === middlewares.length)
    return () => {
      if (callback) callback(req, res);
      else {
        const callback = routing[req.method.toLowerCase()][req.url];
        if (callback) callback(req, res);
      }
    };
  return () =>
    middlewares[index](
      req,
      res,
      recursiveMiddleware(req, res, middlewares, routing, callback, index)
    );
};

const withMiddleware = (middlewares, routing, callback) => {
  return (req, res) => {
    if (middlewares[0])
      middlewares[0](
        req,
        res,
        recursiveMiddleware(req, res, middlewares, routing, callback)
      );
    else {
      if (callback) callback(req, res);
      else {
        const callback = routing[req.method.toLowerCase()][req.url];
        if (callback) callback(req, res);
      }
    }
  };
};

const chooseProtocol = (options, serverFunc) => {
  if (options && options.secure) {
    const { key, cert } = options.secure;
    if (!key || !cert) throw new Error('Secure server must have key and cert');
    return https.createServer(
      { key: fs.readFileSync(key), cert: fs.readFileSync(cert) },
      serverFunc
    );
  } else return http.createServer(serverFunc);
};

const ifExistListen = (options, server) => {
  if (options && options.listen) {
    if (!options.listen.port) logger.error('Server must have port');

    server.listen(
      options.listen.port,
      options.listen.host,
      options.listen.callback
    );
  }
};

class Routing {
  constructor(baseUrl, parent) {
    this.parent = parent;
    this.baseUrl = baseUrl;
  }

  middlewares = [];
  childrens = {};
  use = (callback) => {
    this.middlewares.push(callback);
  };

  get(url, callback) {
    if (this.parent)
      this.parent.get(
        this.baseUrl + url,
        withMiddleware(this.middlewares, null, callback)
      );
  }

  delete(url, callback) {
    if (this.parent)
      this.parent.delete(
        this.baseUrl + url,
        withMiddleware(this.middlewares, null, callback)
      );
  }

  post(url, callback) {
    if (this.parent)
      this.parent.post(
        this.baseUrl + url,
        withMiddleware(this.middlewares, null, callback)
      );
  }

  put(url, callback) {
    if (this.parent)
      this.parent.put(
        this.baseUrl + url,
        withMiddleware(this.middlewares, null, callback)
      );
  }

  subroute(baseUrl) {
    const children = new Routing(baseUrl, this);
    this.childrens[baseUrl] = children;
    return children;
  }

  addEndPoints(...requests) {
    requests.forEach((reqObj) =>
      this.parent[reqObj.method.toLowerCase()](
        this.baseUrl + reqObj.url,
        reqObj.callback
      )
    );
  }
}

class Server extends Routing {
  constructor(options) {
    super('/', null);
    this.server = chooseProtocol(options, (req, res) => {
      withMiddleware(this.middlewares, this.routing)(req, res);
    });
    ifExistListen(options, this.server);
  }

  routing = { get: {}, post: {}, put: {}, delete: {} };
  listen = (port, host = 'localhost', callback = null) => {
    this.server.listen(port, host, callback);
    return this;
  };

  get(url, callback) {
    if (!url) logger.warning('You have to specify the URL in the GET request');
    else this.routing.get[url] = callback;
  }

  delete(url, callback) {
    if (!url)
      logger.warning('You have to specify the URL in the DELETE request');
    else this.routing.delete[url] = callback;
  }

  post(url, callback) {
    if (!url) logger.warning('You have to specify the URL in the POST request');
    else this.routing.post[url] = callback;
  }

  put(url, callback) {
    if (!url) logger.warning('You have to specify the URL in the PUT request');
    else this.routing.put[url] = callback;
  }

  addEndPoints(...requests) {
    requests.forEach((reqObj) =>
      this[reqObj.method.toLowerCase()](reqObj.url, reqObj.callback)
    );
  }
}

const createServer = (options) => {
  return new Server(options);
};

module.exports = createServer;
