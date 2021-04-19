const shvidko = require("../shvidko");
const { Pool } = require("pg"); //for example - postgres

const db = new Pool({
  host: "localhost",
  port: 5432,
  database: "yourDatabase",
  user: "yourDatabaseUser",
  password: "yourUserPassword",
});

const app = shvidko.createServer({
  //listen in options
  listen: {
    port: 3001,
    host: "localhost",
    callback: () => {
      console.log("server is start");
    },
  },
  //use https protocol
  secure: {
    key: `${__dirname}/asserts/cert/key.pem`, //location to your key.pem file
    cert: `${__dirname}/asserts/cert/cert.pem`, //location to your cert.pem file
  },
});
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)
app.use(shvidko.middleware.fileStorage(`${__dirname}/asserts/storage`)); //to use file storage
app.use(shvidko.middleware.database(db)); //to use db in requests
app.use(
  shvidko.middleware.cookieSession(
    //to use cookie sessions
    2 * 60 * 60, //session life in seconds
    `${__dirname}/asserts/sessions`, //path where you want store sessions
    null //session client. It is has the default value (you can use libraries with a similar interface, such as shvidko-redis)
  )
);
app.use(
  shvidko.middleware.cors({
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  })
);
app.use(
  shvidko.middleware.urlParser(
    // checking the existence of the page, the ability to transfer parameters
    app.routing, //app routing
    `<h1>Page not found in GET or DELETE request</h1>` //It is has the default value, can but you can indicate your interpretation when the page is not found
  )
);
app.use(
  shvidko.middleware.bodyParser(
    //checking the existence of the page, you can view the body of the POST and PUT requests
    app.routing, //app routing
    `<h1>Page not found in POST or PUT request</h1>` //It is has the default value, can but you can indicate your interpretation when the page is not found
  )
);

/////// VARIANTS OF REQUESTS ////////

// GET or DELETE : https://localhost:3001/someBad - <h1>Page not found in GET or DELETE request</h1>
// POST or PUT : https://localhost:3001/someBad - <h1>Page not found in POST or PUT request</h1>

// GET : https://localhost:3001/
app.get("/", (req, res) => {
  res.send("Hello from GET");
});

// POST : https://localhost:3001/
app.post("/", (req, res) => {
  res.send("Hello from POST");
});

// DELETE : https://localhost:3001/
app.delete("/", (req, res) => {
  res.send("Hello from DELETE");
});

// PUT : https://localhost:3001/
app.put("/", (req, res) => {
  res.send("Hello from PUT");
});

/////// ways to write requests ////////

const ways = app.subroute("/ways");

// standard
//GET : https://localhost:3001/ways/standard
ways.get("/standard", (req, res) => {
  res.send("standard");
});

// with object and addEndPoints
//GET : https://localhost:3001/ways/object
const withObject = {
  method: "get",
  url: "/object",
  callback: (req, res) => {
    res.send("with object");
  },
};
ways.addEndPoints(withObject);

// with requestCreator and addEndPoints
//GET : https://localhost:3001/ways/requestCreator
const withCreator = shvidko.requestCreator(
  "get",
  "/requestCreator",
  (req, res) => {
    res.send("with requestCreator");
  }
);
ways.addEndPoints(withCreator);

////// DATABASE /////

//GET : https://localhost:3001/database
app.get("/database", async (req, res) => {
  const { rows } = await req.db.query("SELECT * FROM yourTableName;");
  res.send(rows);
});

////// SESSIONS AND FILE STORAGE /////

const fsSessions = app.subroute("/fsSessions");

// url : https://localhost:3001/fsSessions/createDirectory
fsSessions.get("/createDirectory", async (req, res) => {
  const { dirPath } = req.fs.create("create new directory"); // secret key
  await req.session.create({ dir: dirPath });
  res.send(dirPath);
});

// url : https://localhost:3001/fsSessions/addFile/?content=someContent
fsSessions.get("/addFile/?content", async (req, res) => {
  const { dir } = await req.session.get();
  const { fileName, dirPath } = req.fs.set(req.params.content, dir);
  const sessionData = await req.session.get();
  await req.session.set({ ...sessionData, file: fileName });
  res.send(fileName);
});

// url : https://localhost:3001/fsSessions/getFileContent
fsSessions.get("/getFileContent", async (req, res) => {
  const { dir, file } = await req.session.get();
  const filePath = dir + "/" + file;
  const content = req.fs.get(filePath);
  res.send(content, shvidko.statusCode.OK, { "Content-Type": "text/plain" });
});

// url : https://localhost:3001/fsSessions/updateFileContent/?content=newContent
fsSessions.get("/updateFileContent/?content", async (req, res) => {
  const { dir, file } = await req.session.get();
  const filePath = dir + "/" + file;
  const { status } = req.fs.update(filePath, req.params.content);
  res.send(status);
});

// url : https://localhost:3001/fsSessions/deleteFile
fsSessions.get("/deleteFile", async (req, res) => {
  const { dir, file } = await req.session.get();
  const filePath = dir + "/" + file;
  const { status } = req.fs.delete(filePath);
  await req.session.delete();
  res.send(status);
});
