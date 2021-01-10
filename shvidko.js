const http = require('http'),
      https = require('https'),
      {urlStandartForm, urlParser} = require('./parsers/urlParser'),
      bodyParser = require('./parsers/bodyParser'),
      {SessionWrapper, DbWrapper, FStorWrapper} = require("./wrappers"),
      standartOptions = require("./options"),
      fs = require('fs')

class Shvidko {
    constructor(options = defaultOptions) {

        if(options.db){
            this.useDB = true
            this.db = options.db
        }
        
        if(options.sessions){
            this.useSessions = true
            this.sessionsTime = options.sessions.time
            this.sessionsPath = options.sessions.path
            this.sessionClient = options.sessions.client

            if(this.sessionsPath){
                if (!fs.existsSync(this.sessionsPath))
                fs.mkdirSync(this.sessionsPath)
            }  
        }

        if(options.fileStorage){
            this.useFS = true
            this.storager = options.fileStorage.storager
            this.deffaultPath = options.fileStorage.deffaultPath

            if(this.deffaultPath){
                if (!fs.existsSync(this.deffaultPath))
                fs.mkdirSync(this.deffaultPath)
            } 
        }

        this.standartHeaders = options.standartHeaders
        this.routing = {get: {}, post: {}, put: {}, delete: {}}

        const serverFunc = (req, res) => {
            standartOptions(req, res, this.standartHeaders)            
            urlParser(this.routing, req, res)
            bodyParser(this.routing, req, res) 
        }

        if(options.secure){
            const {key, cert} = options.secure
            if(!key || !cert) throw new Error('Secure server must have key and cert')
            this.server = https.createServer({key,cert}, serverFunc)
        }else
            this.server = http.createServer(serverFunc)
        
        
        if(options.listen) {
            if(!options.listen.port) 
            return console.log('WARNING : add port to listen in options')

            this.listen(options.listen.port, options.listen.callback, options.listen.host)
        }
    }

    listen(port, callback = null, host = 'localhost') {
        this.server.listen(port, host, callback);
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
        res.send = (data, ...headerOptions) => {
            if(headerOptions.length !== 0) res.writeHead(...headerOptions)
            if(typeof data == 'object') res.end(JSON.stringify(data))
            else res.end(data)
        }
        res.sendFile = (file, ...headerOptions) => {
            if(headerOptions.length !== 0) res.writeHead(...headerOptions)
            res.end(file)
        }

        if(this.useDB) DbWrapper(req, config, this.db)
        if(this.useSessions) SessionWrapper(req, res, config,  this.sessionsTime, this.sessionsPath, this.sessionClient)
        if(this.useFS) FStorWrapper(req, config, this.deffaultPath, this.storager)

        callback(req, res)
    }
}

module.exports = Shvidko