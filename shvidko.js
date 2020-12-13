const http = require('http'),
      {urlStandartForm, urlParser} = require('./parsers/urlParser'),
      bodyParser = require('./parsers/bodyParser'),
      {SessionWrapper} = require("./wrappers"),
      standartOptions = require("./options")

const defaultOptions = {
    db : null,
    standartHeaders : {
        'Access-Control-Allow-Methods' : 'GET, POST, DELETE, OPTIONS, PUT',
        'Access-Control-Allow-Headers': 'Accept, Content-Type',
        'Access-Control-Allow-Origin': '*'
    },
    sessions : {
        time : null,
        path : './'
    }
}

class Svidko {
    constructor(options = defaultOptions) {
        this.db = options.db
        this.standartHeaders = options.standartHeaders
        if(options.sessions){
            this.sessionsTime = options.sessions.time
            this.sessionsPath = options.sessions.path
            this.sessionClient = options.sessions.client
        }
        this.routing = {get: {}, post: {}, put: {}, delete: {}}
        this.app = http.createServer((req, res) => {
            standartOptions(req, res, this.standartHeaders)            
            urlParser(this.routing, req, res)
            bodyParser(this.routing, req, res) 
        })
    }

    listen(port, callback = null, host = 'localhost') {
        this.app.listen(port, host, callback);
    }

    get(url, callback) {
        const {urlWithoutParams, params} = urlStandartForm(url)
        this.routing.get[urlWithoutParams] = {callback, params}
    }

    delete(url, callback) {
        const {urlWithoutParams, params} = urlStandartForm(url)
        this.routing.delete[urlWithoutParams] = {callback, params}
    }

    post(url, callback) {
        this.routing.post[url] = {callback}
    }

    put(url, callback) {
        this.routing.put[url] = {callback}
    }

    compose(...requests) {
        requests.forEach(reqObj => {
            this[reqObj.method](reqObj.url, (req,res) => {
                res.send = (data) => {
                    if(typeof data == "object") res.end(JSON.stringify(data))
                    else res.end(data)
                }
                if(reqObj.config.useDB) req.db = db

                if(reqObj.config.useSessions) 
                    SessionWrapper(req, res, this.sessionsTime, this.sessionsPath, reqObj.callback, this.sessionClient)
                else reqObj.callback(req, res)
            })
        })
    }
    
}

module.exports = Svidko