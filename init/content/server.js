module.exports = port => `const shvidko = require('shvidko');
const API = require('../API/API');
const options = require('./options');

const app = shvidko.createServer(options);
app.listen(${port}, () => console.log('start server'));

app.compose(...API);`