const fs = require('fs')
const serverContent = require('./content/server')
const optionsContent = require('./content/options')
const APIContent = require('./content/API')
const APIfileContent = require('./content/APIfile')
const dbConnectionContent = require('./content/dbConnection')
const dbInterfaceContent = require('./content/dbInterface')
const API = require('./content/API')

const createDir = (path, name) => {
    const fullPath = path + '/' + name
    if (!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath)
        return 
    } else {
        console.log(new Error('this directory is already exist'));
        process.exit(1)
    }
}

const createFile = (path, name, content, extension = '.js') => {
    const fullPath = path + '/' + name + extension
    fs.writeFileSync(fullPath, content, 'utf-8')
}

const create = {
    file : {
        'dbConnection' : (defPath) => {
            createFile(defPath, 'dbConnection', dbConnectionContent())
        },
        'dbInterface' : (defPath, name) => {
            createFile(defPath, name+'Interface', dbInterfaceContent())
        },
        'server' : (defPath, port) => {
            createFile(defPath, 'server', serverContent(port))
        },
        'options' : (defPath, options) => {
            createFile(defPath, 'options', optionsContent(options))
        },
        'API' : (defPath, pages) => {
            createFile(defPath, 'API', APIContent(pages))
        },
        'APIfile' : (defPath, name) => {
            createFile(defPath, name+'API', APIfileContent(name))
        },
        'cert' : (defPath) => {
            createFile(defPath, 'cert', '', '.pem')
        },
        'key' : (defPath) => {
            createFile(defPath, 'key', '', '.pem')
        }
    },
    dir : {
        'shvidko-app' : (defPath, name) => {
            createDir(defPath, name)
            return `${defPath}/${name}`
        },
        'src' : defPath => {
            createDir(defPath, 'src')
            return `${defPath}/src`
        },
        'API' : defPath => {
            createDir(defPath, 'API')
            return `${defPath}/API`
        },
        'database' : defPath => {
            createDir(defPath, 'database')
            return `${defPath}/database`
        },
        'server' : defPath => {
            createDir(defPath, 'server')
            return `${defPath}/server`
        },
        'cert' :  defPath => {
            createDir(defPath, 'cert')
            return `${defPath}/cert`
        }
    }
}

module.exports = create