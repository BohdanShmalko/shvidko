const {parse} = require("querystring")

const bodyParser = (routing, req, res) => {
    if (req.method == 'POST' || req.method == 'PUT') {
        let method
        req.method == 'POST' ? method = 'post' : method = 'put'
        if(routing[method][req.url]){
            let body = '';

            req.on('data', function (data) {
                body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                //if (body.length > 1e6)
                //req.connection.destroy();
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