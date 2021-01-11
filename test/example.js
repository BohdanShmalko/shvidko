const {createServer, requestCreator} = require('../index'),
      {Pool} = require('pg'),
      fs = require('fs')

const options = {
    standartHeaders : {  //optional option
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    },
    db : new Pool({ 
        host : 'localhost',
        port : 5432,
        database : 'yourDatabase', 
        user : 'yourDatabaseUser', //postgres 
        password : 'yourUserPassword'
        }), //can be Pull from pg library or other (optional option)
    sessions : {
        time : 60*60, //in seconds
        path : `${__dirname}/sessions`
    },
    fileStorage : { 
        deffaultPath : `${__dirname}/storage`
    },
    listen : { //or simple app.listen(port, callback, host)
        port : 3001,
        callback : () => console.log('start server'),
        host : 'localhost'
    },
    // secure : { //for use https protocol
    //     key : fs.readFileSync(`${__dirname}/cert/key.pem`),
    //     cert : fs.readFileSync(`${__dirname}/cert/cert.pem`)
    // } 
}

const app = createServer(options)

///////////////////METHODS TEST/////////////////
/////////////use command $ npm run test///////////////////

const getExample = requestCreator('get', '/someUrl/:value1/:value2', (req, res) => { //example url : http://localhost:3001/someUrl/:10/:ten
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

const postExample = requestCreator('post', '/', (req, res) => {
    const data = req.body
    res.send({say : 'I can give your data', data})
})

const putExample = requestCreator('put', '/', (req, res) => {
    const data = req.body
    res.send({say : 'I can give your data', data})
})

const deleteParamsExample = requestCreator('delete', '/delete/:value1/:value2', (req, res) => {
    const {value1, value2} = req.params
    res.send(`value1 = ${value1} and value2 = ${value2}`)
})

////////////////////DATABASE TEST/////////////////

const dbExample = requestCreator('get', '/dbtest', async (req, res) => {
    let sql = `SELECT * from days`
    let data = await req.db.query(sql).then(data => data.rows).catch(e => {throw e})
    res.send(`data from database : ${JSON.stringify(data)}`)
})

///////////////////////SESSIONS TEST///////////////////

const createSession = requestCreator('get', '/createSession', async (req, res) => {
    const {session} = req
    if(session.isExist()) return res.send('You already use session')
    await session.create()
    res.send('The session create')
}) 

const setSession = requestCreator('get', '/setSession/:someInf', async (req, res) => {
    const {session} = req
    if(!session.isExist()) return res.send('You are not currently using a session')
    await session.set({someInf : req.params.someInf})
    res.send('Set inf to session is successful')
})

const getSession = requestCreator('get', '/getSession', async (req, res) => {
    const {session} = req
    if(!session.isExist()) return res.send('You are not currently using a session')
    const sessionInf = await session.get()
    res.send(sessionInf)
})

const deleteSession = requestCreator('get', '/deleteSession', async (req, res) => {
    const {session} = req
    if(!session.isExist()) return res.send('You are not currently using a session')
    await session.delete()
    res.send('Delete session is successful')
})

////////////////FILE STORAGE TEST//////////////////

app.get('/testfs', async (req, res) => {
    const image1 = fs.readFileSync(`${__dirname}/test1.png`)
    const image2 = fs.readFileSync(`${__dirname}/test2.png`)
    const {filePath, dirPath} = req.fs.set(image1, 'picture') //create new directory
    req.fs.set(image2, 'picture', dirPath) //set to existing directory
    //const {status} = req.fs.delete(filePath)
    const {status} = req.fs.update(filePath, image2)

    const file = req.fs.get(filePath)
    res.sendFile(file, 200, {'Content-Type' : 'image/png'})
})

/////////////////VARIANTS OF WRITING API/////////////

const firstVariant = requestCreator('get', '/first', (req, res) => {
    res.send('this is first variant of writing API')
})

const secondVariant = {
    method : 'get',
    url : '/second',
    callback(req, res){
        res.send('this is second variant of writing API')
    }
}

app.get('/third', (req, res) => {
    res.send('this is third variant of writing API')
})


app.compose(firstVariant, secondVariant, getExample, //if use first or seccond variant
            postExample, putExample, deleteParamsExample, 
            dbExample, createSession, setSession, 
            getSession, deleteSession)
