const Session = require("./session/session")

const SessionWrapper = (req, res, sessionTime, sessionsPath, callback) => {
    const session = new Session(req, res, sessionTime, sessionsPath)
    req.session = session
                       
    callback(req, res)
}

module.exports = {SessionWrapper}

