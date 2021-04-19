const fs = require("fs");
const generator = require("./generator");
const logger = require("./loger");

const toHex = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

const generateName = (type) => toHex(type + generator());

const generateAndCheck = (type, defaultPath, isDir) => {
  let name = generateName(type);
  let path = defaultPath + "/" + name;
  if (!fs.existsSync(path)) {
    if (isDir) fs.mkdirSync(path);
    return name;
  } else generateAndCheck(type, defaultPath, isDir);
};

class Storager {
  constructor(defaultPath) {
    if (!defaultPath) {
      logger.warning("You should pass the initial path to the session file");
      this.defaultPath = "./sessions";
    } else this.defaultPath = defaultPath;

    if (!fs.existsSync(defaultPath)) fs.mkdirSync(defaultPath);
  }

  create = (type = "directory") => {
    const dirName = generateAndCheck(type, this.defaultPath, true);
    const dirPath = this.defaultPath + "/" + dirName;
    return { dirPath };
  };

  set = (file, dirPath, type = "default", encoding = "binary") => {
    if (!dirPath) dirPath = this.create();

    const fileName = generateAndCheck(type, dirPath);

    try {
      fs.writeFileSync(dirPath + "/" + fileName, file, encoding);
      return { fileName, dirPath };
    } catch (e) {
      logger.warning("Failed to create file in file store", e);
    }
  };
  get = (path, encoding = "utf-8") => {
    try {
      return fs.readFileSync(path, encoding);
    } catch (e) {
      logger.warning("Could not get information from file store", e);
    }
  };
  delete = (path) => {
    try {
      fs.unlinkSync(path);
      return { status: "ok" };
    } catch (e) {
      logger.warning("Failed to delete in file store", e);
    }
  };
  update = (path, file, encoding = "binary") => {
    try {
      fs.writeFileSync(path, file, encoding);
      return { status: "ok" };
    } catch (e) {
      logger.warning("Failed to update data in file", e);
    }
  };
}

module.exports = (defaultPath = "./") => (req, res, next) => {
  req.fs = new Storager(defaultPath);
  next();
};
