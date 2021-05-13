const { createServer } = require('./lib/createServer');
const requestCreator = require('./lib/requestCreator');
const middleware = require('./lib/middleware');
const statusCode = require('./lib/statusCode');
const { createLoadBalancer } = require('./lib/loadBalancer/createBalancer');
const balanceAlgorithms = require('./lib/loadBalancer/balanceAlgorithms');

module.exports = {
  createServer,
  requestCreator,
  middleware,
  statusCode,
  createLoadBalancer,
  balanceAlgorithms,
};
