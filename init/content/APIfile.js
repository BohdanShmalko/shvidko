module.exports = (name) => 
`const { requestCreator } = require('shvidko');
const SQL = require('../database/${name}Interface');
    
const testReq = requestCreator('get', '/get${name}Page', (req, res) => {
    res.send('${name} page')
});
    
module.exports = [testReq];`