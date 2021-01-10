const {urlStandartForm, urlParser} = require('./parsers/urlParser'),
      bodyParser = require('./parsers/bodyParser'),
      cbWrapper = require("./serverHelpers/wrappers"),
      standartOptions = require("./serverHelpers/headerOptions"),
      optionChecker = require('./serverHelpers/optionChecker')

const createServer = options => {
    
    let routing = {get: {}, post: {}, put: {}, delete: {}}
    const callbackWrapper = cbWrapper(options)

    const server = optionChecker.chouseProtocol(options, (req, res) => {
        standartOptions(req, res, options.standartHeaders)            
        urlParser(routing, req, res)
        bodyParser(routing, req, res) 
    })

    const listen = (port, callback = null, host = 'localhost') => {
        server.listen(port, host, callback);
        return this
    }
    optionChecker.isExistListen(options, listen)

    return {
        server, listen,
        
        get(url, callback, config = {}) {
            const {urlWithoutParams, params} = urlStandartForm(url)
            routing.get[urlWithoutParams] = {callback : callbackWrapper(callback, config), params}
        },
    
        delete(url, callback, config = {}) {
            const {urlWithoutParams, params} = urlStandartForm(url)
            routing.delete[urlWithoutParams] = {callback : callbackWrapper(callback, config), params}
        },
    
        post(url, callback, config = {}) {
            routing.post[url] = {callback : callbackWrapper(callback, config)}
        },
    
        put(url, callback, config = {}) {
            routing.put[url] = {callback : callbackWrapper(callback, config)}
        },
    
        compose(...requests) {
            requests.forEach(reqObj =>
                this[reqObj.method](reqObj.url, reqObj.callback, reqObj.config))
        }
    }
}

module.exports = createServer