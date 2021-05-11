module.exports = (corsOptions) => (req, res, next) => {
  for (key in corsOptions) {
    res.setHeader(key, corsOptions[key]);
  }
  if (req.method == 'OPTIONS') res.end('ok');
  next();
};
