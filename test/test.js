const {Shvidko, requestCreator} = require("../index"),
      {Pool} = require("pg"),
      fs = require('fs')

const options = {
    db : new Pool({ 
        host : 'localhost',
        port : 5432,
        database : 'yourDatabase', 
        user : 'yourUser', //postgres 
        password : 'yourPassword'
        }), //can be Pull from pg library or other (optional option)
    standartHeaders : {  //optional option
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    },
    sessions : {
        time : 60*60, //in seconds
        path : './sessions/'
    },
    listen : { //or simple app.listen(port, callback, host)
        port : 3001,
        callback : () => console.log("start server"),
        host : 'localhost'
    },
    fileStorage : { 
        deffaultPath : './storage'
    }
}

const app = new Shvidko(options)

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
    res.send(updateData, 200)
}, {useSessions : true}) 

const getParamsExample = requestCreator("get", "/someUrl/:value1/:value2", (req, res) => { //example url : http://localhost:3001/someUrl/:10/:ten
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

const postExample = requestCreator("post", "/", (req, res) => {
    const data = req.body
    res.send({say : "I can give your data", data})
})

const putExample = requestCreator("put", "/", (req, res) => {
    const data = req.body
    res.send({say : "I can give your data", data})
})

const deleteParamsExample = requestCreator("delete", "/delete/:value1/:value2", (req, res) => {
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

const dbExample = requestCreator("get", "/dbtest", async (req, res) => {
    let sql = `SELECT * from days`
    let data = await req.db.query(sql).then(async data => {
        return data.rows
    }).catch(e => {throw e})
    res.send(`data from database : ${JSON.stringify(data)}`)
}, {useDB : true})

app.get('/somesimpleget', async (req, res) => {
    let session = req.session
    await session.set({someData : 'some data'})
    let updateData = await session.get()
    res.send(updateData, 200)
}, {useSessions : true})

app.get('/testforfs', async (req, res) => {
    const image1 = fs.readFileSync('./test1.png')
    const image2 = fs.readFileSync('./test2.png')
    const {filePath} = req.fs.set(image1, 'picture')
    //const {status} = req.fs.delete(filePath)
    const {status} = req.fs.update(filePath, image2)

    const file = req.fs.get(filePath)
    res.sendFile(file, 200, {'Content-Type' : 'image/png'})
}, {useFileStorage : true})

app.compose(getExample, getParamsExample, postExample,
            sessionTest, putExample, deleteParamsExample,
            dbExample)
