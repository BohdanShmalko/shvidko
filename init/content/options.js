module.exports = options => {

const {db, sessions, secure, fs} = options
let resultStr = `const fs = require('fs');\n`
if(db) resultStr += `const dbConnection = require('../database/dbConnection');\n
const db = dbConnection('${db.host}', ${db.port}, '${db.database}', '${db.user}', '${db.password}');\n`
resultStr += `module.exports = {\n`
if(db) resultStr += `  db,\n`
resultStr += `  standartHeaders: {
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS, PUT',
  },\n`
if(sessions) resultStr += `  sessions: {
    time: ${sessions.time},
    path : '${sessions.path}',
  },\n`
if(fs) resultStr += `  fileStorage: {
    deffaultPath: '${fs.path}',
  },\n`
if(secure) resultStr += `  secure: {
    key: fs.readFileSync(__dirname + '/cert/cert.pem'), //You must fill file cert.pem
    cert: fs.readFileSync(__dirname + '/cert/key.pem'), //You must fill file key.pem
  },\n`
resultStr += '};'
return resultStr
}