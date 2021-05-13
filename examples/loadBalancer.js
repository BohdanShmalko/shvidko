const shvidko = require('../shvidko');

const lb = shvidko.createLoadBalancer().listen(3001);
lb.addServers(
  'http://localhost:3011',
  'http://localhost:3021',
  'http://localhost:3031'
);
lb.setLoadAlgorithm(shvidko.balanceAlgorithms.roundRobin); //default value
lb.setHealthTime(3);

const app1 = shvidko.createServer().listen(3011).useWithBalancer();
app1.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : http://localhost:3001/
app1.get('/', (req, res) => {
  res.send('Hello world! from server 1');
});

const app2 = shvidko.createServer().listen(3021);
app2.useWithBalancer();
app2.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : http://localhost:3001/
app2.get('/', (req, res) => {
  res.send('Hello world! from server 2');
});

const app3 = shvidko.createServer().listen(3031).useWithBalancer();
app3.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : http://localhost:3001/
app3.get('/', (req, res) => {
  res.send('Hello world! from server 3');
});
