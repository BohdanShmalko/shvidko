const fs = require('fs'),
      http = require('http'),
      https = require('https')

const isExistDB = options => {
    if(options.db){
        return {useDB : true, db : options.db}
    }
    return {}
}

const isExistSession = options => {
    if(options.sessions){
        const {time, path, client} = options.sessions

        if(this.sessionsPath){
            if (!fs.existsSync(this.sessionsPath))
            fs.mkdirSync(this.sessionsPath)
        }  
        return {time, path, client, useSessions : true}
    }
    return {}
}

const isExistFileStorage = options => {
    if(options.fileStorage){
        const {storager, deffaultPath} = options.fileStorage

        if(this.deffaultPath){
            if (!fs.existsSync(this.deffaultPath))
            fs.mkdirSync(this.deffaultPath)
        }
        return {storager, deffaultPath, useFS : true}
    }
    return {}
} 

const chouseProtocol = (options, serverFunc) => {
    if(options.secure){
        const {key, cert} = options.secure
        if(!key || !cert) throw new Error('Secure server must have key and cert')
        return https.createServer({key,cert}, serverFunc)
    }else
        return http.createServer(serverFunc)
}

const isExistListen = (options, listen) => {
    if(options.listen) {
        if(!options.listen.port) 
            return console.log('WARNING : add port to listen in options')

        listen(options.listen.port, options.listen.callback, options.listen.host)
    }
}

module.exports = {isExistDB, isExistSession, isExistFileStorage, chouseProtocol, isExistListen}