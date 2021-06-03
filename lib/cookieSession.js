const Session = require('./session/session');

module.exports = (sessionTime, sessionsPath, sessionClient) => (
  req,
  res,
  next
) => {
  req.session = new Session(req, res, sessionTime, sessionsPath, sessionClient);
  next();
};
