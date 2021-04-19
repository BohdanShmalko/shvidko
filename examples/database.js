const shvidko = require("../shvidko");
const { Pool } = require("pg"); //for example - postgres

const db = new Pool({
  host: "localhost",
  port: 5432,
  database: "yourDatabase",
  user: "yourDatabaseUser",
  password: "yourUserPassword",
});

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)
app.use(shvidko.middleware.urlParser(app.routing)); // checking the existence of the page, the ability to transfer parameters
app.use(shvidko.middleware.database(db)); //to use db in requests

// url : http://localhost:3001/addToDb/?name=YourName
app.get("/addToDb/?name", async (req, res) => {
  await req.db.query("INSERT INTO users (name) VALUES ($1);", [req.params.name]);
  res.send("addition successful");
});

// url : http://localhost:3001/setFromDb
app.get("/setFromDb", async (req, res) => {
  const { rows } = await req.db.query("SELECT * FROM users;");
  res.send(rows);
});
