const shvidko = require('../shvidko');

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)
app.use(shvidko.middleware.urlParser(app.routing)); // checking the existence of the page, the ability to transfer parameters
app.use(
  shvidko.middleware.cookieSession(1 * 60 * 60, `${__dirname}/asserts/Sessions`) //to use cookie sessions
);

// url : http://localhost:3001/createSession
app.get('/createSession', async (req, res) => {
  await req.session.create();
  res.send('Session is created');
});

// url : http://localhost:3001/setToSession/?inf=someInf
app.get('/setToSession/?inf', async (req, res) => {
  const oldData = await req.session.get(); //old data {}
  await req.session.set({ ...oldData, inf: req.params.inf }); //new data {inf : "someInf"}
  res.send('addition successful');
});

// url : http://localhost:3001/getFromSession
app.get('/getFromSession', async (req, res) => {
  const data = await req.session.get();
  res.send(data);
});

// url : http://localhost:3001/deleteSession
app.get('/deleteSession', async (req, res) => {
  await req.session.delete();
  res.send('removal successful');
});
