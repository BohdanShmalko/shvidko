const { parse } = require('querystring');

module.exports = (routing, pageNotFound = 'page not found') => (
  req,
  res,
  next
) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    let method = req.method.toLowerCase();
    if (routing[method][req.url]) {
      let body = '';

      req.on('data', function (data) {
        body += data;
      });

      req.on('end', function () {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          req.body = parse(body);
        }
      });
    } else {
      res.writeHead(404);
      res.end(pageNotFound);
      return;
    }
  }
  next();
};
