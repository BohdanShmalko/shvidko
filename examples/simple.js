const shvidko = require('../shvidko');

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : http://localhost:3001/
app.get('/', (req, res) => {
  res.send('Hello world!');
});
