const { createWithProtocol, ifExistListen } = require('../createServer');
const http = require('http');
const https = require('https');
const logger = require('../loger');
const { roundRobin } = require('./balanceAlgorithms');

const chooseProtocol = (url) => {
  const [protocol] = url.split('://');
  if (protocol === 'http') return http;
  else if (protocol === 'https') return https;
  throw new Error('This protocol is not supported');
};

const separateUrl = (url) => {
  const [protocol, another] = url.split('://');
  if (!another) return logger.error('incorrectly specified url');
  const [host, port] = another.split(':');
  return { protocol, host, port };
};

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    try {
      chooseProtocol(url).request(options, (response) => {
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const resend = (req, res, server, url) => {
  const path = url ? url : req.url;
  const { host, port } = separateUrl(server);
  const options = {
    host,
    port: Number(port),
    path,
    method: req.method,
    headers: req.headers,
  };
  return chooseProtocol(server).request(options, (response) => {
    let data = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', function () {
      res.end(data);
    });
  });
};

const checkServers = (serversPool, healthUrl, healthyPool) => {
  serversPool.forEach((url, i) => {
    const { host, port } = separateUrl(url);
    const options = {
      host,
      port: Number(port),
      path: healthUrl,
      method: 'GET',
    };

    chooseProtocol(url)
      .request(options, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', function () {
          const { isHealthy } = JSON.parse(data);
          healthyPool[i] = isHealthy;
        });
      })
      .end();
  });
};

class LoadBalancer {
  healthyPool = [];
  serversPool = [];
  healthTime = 10;
  endPoint = '/health/for/load/balancer/shvidko';
  algorithm = roundRobin;
  constructor(options) {
    this._reloadTimeout();
    this.loadBalancerServer = createWithProtocol(options, (req, res) => {
      const index = this.algorithm(req, this.serversPool, this.healthyPool);
      if (index === -1) {
        res.statusCode = 500;
        res.end('fail');
        return;
      }
      const server = this.serversPool[index];
      resend(req, res, server).end();
    });
    ifExistListen(options, this.loadBalancerServer);
  }

  listen(port, host = 'localhost', callback = null) {
    this.loadBalancerServer.listen(port, host, callback);
    return this;
  }

  addServers(...servers) {
    this.serversPool.push(...servers);
  }

  setHealthTime(healthTime) {
    this.healthTime = healthTime;
    this._reloadTimeout();
  }

  setHealthEndPoint(endPoint) {
    this.endPoint = endPoint;
    this._reloadTimeout();
  }

  setLoadAlgorithm(callback) {
    this.algorithm = callback;
  }

  _reloadTimeout() {
    this.timerId && clearTimeout(this.timerId);

    this.timerId = setInterval(() => {
      checkServers(this.serversPool, this.endPoint, this.healthyPool);
    }, this.healthTime * 1000);
  }
}

const createLoadBalancer = (options) => new LoadBalancer(options);

module.exports = { createLoadBalancer, chooseProtocol, separateUrl };
