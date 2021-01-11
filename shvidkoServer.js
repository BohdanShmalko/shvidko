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
        
        get(url, callback) {
            const {urlWithoutParams, params} = urlStandartForm(url)
            routing.get[urlWithoutParams] = {callback : callbackWrapper(callback), params}
        },
    
        delete(url, callback) {
            const {urlWithoutParams, params} = urlStandartForm(url)
            routing.delete[urlWithoutParams] = {callback : callbackWrapper(callback), params}
        },
    
        post(url, callback) {
            routing.post[url] = {callback : callbackWrapper(callback)}
        },
    
        put(url, callback) {
            routing.put[url] = {callback : callbackWrapper(callback)}
        },
    
        compose(...requests) {
            requests.forEach(reqObj =>
                this[reqObj.method.toLowerCase()](reqObj.url, reqObj.callback))
        }
    }
}

module.exports = createServer