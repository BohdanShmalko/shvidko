const fs = require('fs');
const logger = require('../lib/loger');
const jstParser = require('./jstParser');

class Creator {
  constructor(path) {
    this.path = path;
  }

  createDir(name) {
    const fullPath = this.path + '/' + name;
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      return new Creator(fullPath);
    } else {
      logger.error('This directory is already exist');
      process.exit(1);
    }
  }

  createFile(name, templatePath, params, extension = '.js') {
    const fullPath = this.path + '/' + name + extension;

    try {
      let jst = fs.readFileSync(templatePath, 'utf-8');
      const js = jstParser(jst, params).parse();

      fs.writeFileSync(fullPath, js, 'utf-8');
    } catch (err) {
      logger.warning('Bad path to file', err);
    }
  }
}

module.exports = (path) => new Creator(path);
