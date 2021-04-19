const bodyParser = require("./bodyParser");
const database = require("./database");
const cookieSession = require("./cookieSession");
const cors = require("./cors");
const fileStorage = require("./fileStorage");
const urlParser = require("./urlParser");
const sender = require("./sender");

module.exports = {
  bodyParser,
  database,
  cookieSession,
  cors,
  fileStorage,
  urlParser,
  sender,
};
