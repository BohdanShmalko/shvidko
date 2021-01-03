const Session = require('./session/session'),
      Storager = require('./fileStorage/deffaultStorager')

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

module.exports = {SessionWrapper, DbWrapper, FStorWrapper}

