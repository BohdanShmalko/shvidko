const Session = require('../session/session'),
      Storager = require('../fileStorage/deffaultStorager'),
      optionChecker = require('./optionChecker')

const SessionWrapper = (req, res, sessionTime, sessionsPath, sessionClient) => {
    req.session = new Session(req, res, sessionTime, sessionsPath, sessionClient)
}

const DbWrapper = (req, db) => {
    req.db = db
}

const FStorWrapper = (req, deffaultPath, storager) => { 
    !storager ? req.fs = new Storager(deffaultPath) : req.fs = storager
}

const callbackWrapper = (options) => {

const {db, useDB} = optionChecker.isExistDB(options)
const {storager, deffaultPath, useFS} = optionChecker.isExistFileStorage(options)
const {time, path, client, useSessions} = optionChecker.isExistSession(options)

return (callback) => (req, res) => {
    res.send = (data, ...headerOptions) => {
        if(headerOptions.length !== 0) res.writeHead(...headerOptions)
        if(typeof data == 'object') res.end(JSON.stringify(data))
        else res.end(data)
    }
    res.sendFile = (file, ...headerOptions) => {
        if(headerOptions.length !== 0) res.writeHead(...headerOptions)
        res.end(file)
    }

    if(useDB) DbWrapper(req, db)
    if(useSessions) SessionWrapper(req, res, time, path, client)
    if(useFS) FStorWrapper(req, deffaultPath, storager)

    callback(req, res)
    }
}

module.exports = callbackWrapper

