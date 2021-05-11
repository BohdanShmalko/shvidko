const shvidko = require('../shvidko');

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)
app.use(shvidko.middleware.urlParser(app.routing)); // checking the existence of the page, the ability to transfer parameters
app.use(shvidko.middleware.bodyParser(app.routing)); //checking the existence of the page, you can view the body of the POST and PUT requests

// url : http://localhost:3001/someBadPage - page not found

// url : http://localhost:3001/somePageWithParams/?param1=something1;param2=something2
app.get('/somePageWithParams/?param1;param2', (req, res) => {
  res.send(`Your params : ${req.params.param1} and ${req.params.param2}`, 101);
});

// POST : http://localhost:3001/someBadPage - page not found

//POST : http://localhost:3001/checkBody
app.post('/checkBody', (req, res) => {
  const data = req.body;
  res.send('this is POST');
});
