const shvidko = require('../shvidko');

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)
app.use(shvidko.middleware.urlParser(app.routing)); // checking the existence of the page, the ability to transfer parameters
app.use(shvidko.middleware.fileStorage(`${__dirname}/asserts/storage`)); //to use file storage

let dir, file; //Don't do that! The name must be stored in a separate place (for example, in a database)

// url : http://localhost:3001/createDirectory
app.get('/createDirectory', (req, res) => {
  const { dirPath } = req.fs.create();
  dir = dirPath;
  res.send(dirPath);
});

// url : http://localhost:3001/addFile/?content=someContent
app.get('/addFile/?content', (req, res) => {
  const { fileName, dirPath } = req.fs.set(req.params.content, dir);
  file = fileName;
  res.send(fileName);
});

// url : http://localhost:3001/getFileContent
app.get('/getFileContent', (req, res) => {
  const filePath = dir + '/' + file;
  const content = req.fs.get(filePath);
  res.send(content, shvidko.statusCode.OK, { 'Content-Type': 'text/plain' });
});

// url : http://localhost:3001/updateFileContent/?content=newContent
app.get('/updateFileContent/?content', (req, res) => {
  const filePath = dir + '/' + file;
  const { status } = req.fs.update(filePath, req.params.content);
  res.send(status);
});

// url : http://localhost:3001/deleteFile
app.get('/deleteFile', (req, res) => {
  const filePath = dir + '/' + file;
  const { status } = req.fs.delete(filePath);
  res.send(status);
});
