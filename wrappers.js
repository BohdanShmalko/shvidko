const Session = require("./session/session")

const SessionWrapper = (req, res, sessionClient, sessionTime, callback) => {
    const  session = new Session(req, res, sessionClient, sessionTime)
    session.get( data => {
    data = JSON.parse(data)
    req.session = {
        token : session.token,
        data,
        set(obj) {
            session.set(obj)
        }
    }
    session.end()                           
    callback(req, res)
    })
}

module.exports = {SessionWrapper}

