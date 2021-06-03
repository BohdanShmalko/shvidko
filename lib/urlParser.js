module.exports = (routing, pageNotFound = 'page not found') => (
  req,
  res,
  next
) => {
  if (req.method === 'GET' || req.method === 'DELETE') {
    let method = req.method.toLowerCase();
    let rowUrl = '';
    const reqParams = {};
    const [mainUrl, paramString] = req.url.split('/?');
    rowUrl += mainUrl;
    if (paramString) {
      rowUrl += '/?';
      const rowParams = paramString.split(';');
      for (let i = 0; i < rowParams.length; i++) {
        const [param, value] = rowParams[i].split('=');
        reqParams[param] = value;
        rowUrl += param;
        if (i !== rowParams.length - 1) rowUrl += ';';
      }
    }
    if (routing[method][rowUrl]) {
      const isEmptyObject = !Object.keys(reqParams).length;
      if (!isEmptyObject) req.params = reqParams;
      req.url = rowUrl;
    } else {
      res.writeHead(404);
      res.end(pageNotFound);
      return;
    }
  }
  next();
};
