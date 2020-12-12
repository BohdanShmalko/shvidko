const {Svidko, requestCreator} = require("../index")

const options = {
    db : null, //can be Pull from pg library or other (optional option)
    standartHeaders : {  //optional option
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    },
    sessionsClient : null, //optional option (under development)
    sessionsTime : 60 * 60 * 2 //two hours
}

const app = new Svidko(options)
app.listen(3001, () => console.log("start server"), "localhost")

const getExample = requestCreator("get", "/", (req, res) => {
    res.send("this is my main page")
    //const db = req.db //if you use database
}, {useDB : false, useSessions : false}) // optional settings if no sessions or database are used

const getParamsExample = requestCreator("get", "/someUrl/:value1/:value2", (req, res) => { //example url : http://localhost:3001/someUrl/:10/:ten
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

const postExample = requestCreator("post", "/", (req, res) => {
    const data = req.body
    res.send({say : "I can give your data", data})
})



app.compose(getExample, getParamsExample, postExample)
