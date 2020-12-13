const http = require('http'),
      {urlStandartForm, getParser} = require('./parsers/GETparser'),
      postParser = require('./parsers/POSTparser'),
      {SessionWrapper} = require("./wrappers"),
      standartOptions = require("./options")

const defaultOptions = {
    db : null,
    standartHeaders : {
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, DELETE, OPTIONS',
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
        }
        this.routing = {get: {}, post: {}}
        this.app = http.createServer((req, res) => {
            standartOptions(req, res, this.standartHeaders)            
            getParser(this.routing.get, req, res)
            postParser(this.routing.post, req, res) 
        })
    }

    listen(port, callback = null, host = 'localhost') {
        this.app.listen(port, host, callback);
    }

    get(url, callback) {
        const {urlWithoutParams, params} = urlStandartForm(url)
        this.routing.get[urlWithoutParams] = {callback, params}
    }

    post(url, callback) {
        this.routing.post[url] = {callback}
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
                    SessionWrapper(req, res, this.sessionsTime, this.sessionsPath, reqObj.callback)
                else reqObj.callback(req, res)
            })
        })
    }
    
}

module.exports = Svidko