const shvidko = require("../shvidko");
const endPoints = require("./anotherFile");

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

const newBranch = app.subroute("/baseUrl");

app.addEndPoints(...endPoints.main);
newBranch.addEndPoints(...endPoints.branch);
