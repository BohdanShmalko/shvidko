module.exports = () => (req, res, next) => {
  res.send = (data, ...headerOptions) => {
    if (headerOptions.length !== 0) res.writeHead(...headerOptions);
    if (typeof data === 'object') res.end(JSON.stringify(data));
    else res.end(data);
  };
  next();
};
