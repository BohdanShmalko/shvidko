const shvidko = require('../shvidko');

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

const newBranch = app.subroute('/baseUrl');

// url : http://localhost:3001/baseUrl/yourRoute
newBranch.get('/yourRoute', (req, res) => {
  res.send('Hello world!');
});

// url : http://localhost:3001/baseUrl/youAnotherRoute
app.childrens['/baseUrl'].get('/youAnotherRoute', (req, res) => {
  res.send('Hello world 2!');
});
