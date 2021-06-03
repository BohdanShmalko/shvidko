const logger = require('./loger');

module.exports = (db) => (req, res, next) => {
  if (!db)
    logger.warning(
      'You must pass as a connection parameter to your database in the middleware'
    );
  req.db = db;
  next();
};
