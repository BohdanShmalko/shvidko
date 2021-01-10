const Session = require('../session/session'),
      Storager = require('../fileStorage/deffaultStorager'),
      optionChecker = require('./optionChecker')

const SessionWrapper = (req, res, config, sessionTime, sessionsPath, sessionClient) => {
    if(config.useSessions) {
        const session = new Session(req, res, sessionTime, sessionsPath, sessionClient)
        req.session = session
    }
}

const DbWrapper = (req, config, db) => {
    if(config.useDB) req.db = db
}

const FStorWrapper = (req, config, deffaultPath, storager) => {
    if(config.useFileStorage) 
        !storager ? req.fs = new Storager(deffaultPath) : req.fs = storager
}

const callbackWrapper = (options) => {

const {db, useDB} = optionChecker.isExistDB(options)
const {storager, deffaultPath, useFS} = optionChecker.isExistFileStorage(options)
const {time, path, client, useSessions} = optionChecker.isExistSession(options)

return (callback, config) => (req, res) => {
    res.send = (data, ...headerOptions) => {
        if(headerOptions.length !== 0) res.writeHead(...headerOptions)
        if(typeof data == 'object') res.end(JSON.stringify(data))
        else res.end(data)
    }
    res.sendFile = (file, ...headerOptions) => {
        if(headerOptions.length !== 0) res.writeHead(...headerOptions)
        res.end(file)
    }

    if(useDB) DbWrapper(req, config, db)
    if(useSessions) SessionWrapper(req, res, config, time, path, client)
    if(useFS) FStorWrapper(req, config, deffaultPath, storager)

    callback(req, res)
    }
}

module.exports = callbackWrapper

