const Session = require("./session/session")

const SessionWrapper = (req, res, sessionTime, sessionsPath, callback, sessionClient) => {
    const session = new Session(req, res, sessionTime, sessionsPath, sessionClient)
    req.session = session
                       
    callback(req, res)
}

module.exports = {SessionWrapper}

