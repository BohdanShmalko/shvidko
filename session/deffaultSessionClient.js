const fs = require('fs'),
      v8 = require('v8')

const SessionClient = {
    
    create : async (token, path) => {
        if(token.indexOf('/') + 1 || token.indexOf('_') + 1)  throw "token is broken"
        let startData = v8.serialize({lol : "kek"})
        await fs.appendFile(path + token, startData, err => {
            if (err) throw err
          })
    },

    set : async (token, newData, path) => {
        await fs.writeFile(path + token, v8.serialize(newData), err => {
            if(err) throw err
        })
    },
    get : (token, path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path + token, (err, data) => {
                    if(err) reject(err)
                    resolve(v8.deserialize(data))
                })
          });
    },
    delete : async (token, path) => {
        await fs.unlink(path + token, err => {
            if (err) throw err
          })
    }
}

module.exports = SessionClient