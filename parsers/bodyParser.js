const {parse} = require("querystring")

const bodyParser = (routing, req, res) => {
    if (req.method == 'POST' || req.method == 'PUT') {
        let method = req.method.toLowerCase()
        if(routing[method][req.url]){
            let body = '';

            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                try{
                    let parseData = JSON.parse(body)
                    req.body = parseData
                }
                catch (e){
                    let parseData = parse(body)
                    req.body = parseData
                }
                routing[method][req.url].callback(req, res)
            });
        }else res.end('page not found')
    }
}

module.exports = bodyParser