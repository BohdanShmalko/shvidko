const {Svidko, requestCreator} = require("../index")

const options = {
    db : null, //can be Pull from pg library or other (optional option)
    standartHeaders : {  //optional option
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    },
    sessions : {
        time : 60*60, //in seconds
        path : './sessions/'
    }
}

const app = new Svidko(options)
app.listen(3001, () => console.log("start server"), "localhost")

const getExample = requestCreator("get", "/", (req, res) => {
    res.send("this is my main page")
    //const db = req.db //if you use database
}, {useDB : false, useSessions : false}) // optional settings if no sessions or database are used

const sessionTest = requestCreator("get", "/sessionTest", async (req, res) => {
    let session = req.session
    let data = await session.get()
    data.test = "data"
    await session.set(data)
    let updateData = await session.get()
    console.log(updateData);
    res.send("this is test session page")
}, {useDB : false, useSessions : true}) 

const getParamsExample = requestCreator("get", "/someUrl/:value1/:value2", (req, res) => { //example url : http://localhost:3001/someUrl/:10/:ten
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

const postExample = requestCreator("post", "/", (req, res) => {
    const data = req.body
    console.log(data);
    res.send({say : "I can give your data", data})
})

const putExample = requestCreator("put", "/", (req, res) => {
    const data = req.body
    console.log(data);
    res.send({say : "I can give your data", data})
})

const deleteParamsExample = requestCreator("delete", "/delete/:value1/:value2", (req, res) => {
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

app.compose(getExample, getParamsExample, postExample, sessionTest, putExample, deleteParamsExample)
