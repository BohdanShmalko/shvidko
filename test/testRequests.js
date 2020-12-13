const request = require('request');

const baseUrl = "http://localhost:3001"

request(`${baseUrl}/`, {json: true, method: 'GET'}, (err, res, body) => {
    if (err) { throw err }
    console.log('GET result :', body);
});

request(`${baseUrl}/someUrl/:someValue1/:someValue2`, {json: true, method: 'GET'}, (err, res, body) => {
    if (err) { throw err }
    console.log('GET with params result :', body);
});

request(`${baseUrl}/`, {json: true, method: 'POST', body: {data : "some data"}}, (err, res, body) => {
    if (err) { throw err }
    console.log('POST result :', body);
});

request(`${baseUrl}/`, {json: true, method: 'PUT', body: {example : "some data with PUT method"}}, (err, res, body) => {
    if (err) { throw err }
    console.log('PUT result :', body);
});

request(`${baseUrl}/delete/:one/:two`, {json: true, method: 'DELETE'}, (err, res, body) => {
    if (err) { throw err }
    console.log('DELETE result :', body);
});

request(`${baseUrl}/dbtest`, {json: true, method: 'GET'}, (err, res, body) => {
    if (err) { throw err }
    console.log('GET test DB result :', body);
});