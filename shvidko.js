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

class Shvidko {
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

        if(options.listen) {
            if(!options.listen.port) 
            return console.log('WARNING : add port to listen in options')

            this.listen(options.listen.port, options.listen.callback, options.listen.host)
        }
    }

    listen(port, callback = null, host = 'localhost') {
        this.app.listen(port, host, callback);
        return this
    }

    get(url, callback, config = {}) {
        const {urlWithoutParams, params} = urlStandartForm(url)
        this.routing.get[urlWithoutParams] = {callback : this.callbackWrapper(callback, config), params}
    }

    delete(url, callback, config = {}) {
        const {urlWithoutParams, params} = urlStandartForm(url)
        this.routing.delete[urlWithoutParams] = {callback : this.callbackWrapper(callback, config), params}
    }

    post(url, callback, config = {}) {
        this.routing.post[url] = {callback : this.callbackWrapper(callback, config)}
    }

    put(url, callback, config = {}) {
        this.routing.put[url] = {callback : this.callbackWrapper(callback, config)}
    }

    compose(...requests) {
        requests.forEach(reqObj =>
            this[reqObj.method](reqObj.url, reqObj.callback, reqObj.config))
    }

    callbackWrapper = (callback, config) => (req, res) => {
        res.send = (data, status) => {
            if(status) res.writeHead(status)
            if(typeof data == 'object') res.end(JSON.stringify(data))
            else res.end(data)
        }
        if(config.useDB) req.db = this.db

        if(config.useSessions) 
            SessionWrapper(req, res, this.sessionsTime, this.sessionsPath, callback, this.sessionClient)
        else callback(req, res)
    }
}

module.exports = Shvidko