const shvidko = require("../shvidko");

const app = shvidko
  .createServer({
    secure: {
      key: `${__dirname}/asserts/cert/key.pem`, //location to your key.pem file
      cert: `${__dirname}/asserts/cert/cert.pem`, //location to your cert.pem file
    },
  })
  .listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : https://localhost:3001/
app.get("/", (req, res) => {
  res.send("Hello world!");
});
