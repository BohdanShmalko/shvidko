const Flag = require('./flag')
const create = require('./create')
const readConsole = require('./readConsole')

const flag = new Flag();

let name = flag.add('name', 'shvidko-app', 'name of your future shvidko application')
let path = flag.add('path', '../../', 'path where to create an application')
let port = flag.add('port', 3000, 'port for your future application')

flag.complete()

const main = (async () => {
    console.clear()
    const options = {}

    const rlName = await readConsole.messageReplace(`App name (${name.value}) : `)
    if(rlName) name.value = rlName
    const rlPath = await readConsole.messageReplace(`App path (${path.value}) : `)
    if(rlPath) path.value = rlPath
    const appPort = await readConsole.messageReplace(`App port (${port.value}) : `)
    if(appPort) port.value = appPort
    
    const useDb = await readConsole.messageYN('Do you want use database', 'n')
    if(useDb){
        let host = await readConsole.messageReplace('   Enter host to your database (localhost) : ')
        if(!host) host = 'localhost'
        let port = await readConsole.messageReplace('   Enter port to your database (5432) : ')
        if(!port) port = 5432
        let database = await readConsole.messageReplace('   Enter database name (postgres) : ')
        if(!database) database = 'postgres'
        let user = await readConsole.messageReplace('   Enter user name to your database (postgres) : ')
        if(!user) user = 'postgres'
        let password = await readConsole.messageReplace('   Enter password to your database (1111) : ')
        if(!password) password = '1111'
        options.db = {host, port, database, user, password}
    }
    const useSession = await readConsole.messageYN('Do you want use session')
    if(useSession){
        let time = await readConsole.messageReplace('   Enter the lifetime of the session (null === Infinity) : ')
        if(!time) time = null
        let path = await readConsole.messageReplace('   Enter the path where the sessions will be stored (./sessions) : ')
        if(!path) path = './sessions'
        options.sessions = {time, path}
    }
    const useFileStorage = await readConsole.messageYN('Do you want use file storage')
    if(useFileStorage){
        let path = await readConsole.messageReplace('Enter the path where the files will be stored (./files) : ')
        if(!path) path = './files'
        options.fs = {path}
    }
    const useSecure = await readConsole.messageYN('Do you want use file secure protocol')
    if(useSecure) options.secure = useSecure

    const allPages = await readConsole.messageLoop('Do you want create new API page', '   Write page name', 'page')

    readConsole.close()

    const mainPath =  create.dir['shvidko-app'](path.value, name.value)
    const src =  create.dir.src(mainPath)
    const API =  create.dir.API(src)
    const server =  create.dir.server(src)
    if(options.db){
        const database =  create.dir.database(src)
        create.file.dbConnection(database)
        allPages.forEach(page => create.file.dbInterface(database, page))
    }
    if(options.secure) {
        const cert = create.dir.cert(server)
        create.file.cert(cert)
        create.file.key(cert)
    }

    create.file.server(server, port.value)
    create.file.options(server, options)
    create.file.API(API, allPages)
    allPages.forEach(page => create.file.APIfile(API, page))

    console.log(`Ener "node ${path.value + '/' + name.value}/src/server/server.js" in console to run server`);
})()

