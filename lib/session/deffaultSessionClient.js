const fs = require("fs");
const v8 = require("v8");
const logger = require("../loger");

class SessionClient {
  constructor(path) {
    if (!path) {
      logger.warning("You need to pass the initial path to the file store");
      this.path = "./storage/";
    } else this.path = path;
    if (this.path[this.path.length - 1] !== "/") this.path += "/";
    if (!fs.existsSync(path)) fs.mkdirSync(path);
  }

  create = (token, inf) => {
    if (token.indexOf("/") + 1 || token.indexOf("_") + 1)
      logger.warning("Token is broken");
    let startData = v8.serialize(inf);
    return new Promise((resolve, reject) => {
      fs.appendFile(this.path + token, startData, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };

  set = (token, newData) =>
    new Promise((resolve, reject) => {
      fs.writeFile(this.path + token, v8.serialize(newData), (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

  get = (token) =>
    new Promise((resolve, reject) => {
      fs.readFile(this.path + token, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(v8.deserialize(data));
      });
    });

  delete = (token) =>
    new Promise((resolve, reject) => {
      fs.unlink(this.path + token, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
}

module.exports = SessionClient;
