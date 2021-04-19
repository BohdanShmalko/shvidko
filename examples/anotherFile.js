const shvidko = require("../shvidko");

// GET : http://localhost:3001/
const mainGET = shvidko.requestCreator("get", "/", (req, res) => {
  res.send("GET from main app");
});

// GET : http://localhost:3001/baseUrl/
const branchGET = shvidko.requestCreator("get", "/", (req, res) => {
  res.send("GET from newBranch app");
});

// POST : http://localhost:3001/
const mainPOST = shvidko.requestCreator("post", "/", (req, res) => {
  res.send("POST from main app");
});

module.exports = {
  main: [mainGET, mainPOST],
  branch: [branchGET],
};
