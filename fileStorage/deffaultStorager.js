const fs = require('fs')

const FILE_LENGTH = 100,
      ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz',
      ALPHA = ALPHA_UPPER + ALPHA_LOWER,
      DIGIT = '0123456789',
      ALPHA_DIGIT = ALPHA + DIGIT

const toHex = str => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

const generateName = type => {
  const base = ALPHA_DIGIT.length;
  let key = '';
  for (let i = 0; i < FILE_LENGTH; i++) {
    const index = Math.floor(Math.random() * base);
    key += ALPHA_DIGIT[index];
  }
  return toHex(type + key)
}

const geterateAndCheck = (type, deffaultPath, isDir) => {
    let name = generateName(type)
    let path = deffaultPath + '/' + name
    if (!fs.existsSync(path)){
        if(isDir)
            fs.mkdirSync(path)
        return path
    }  
    else geterateAndCheck(type, deffaultPath)
}

class Storager {
    constructor(deffaultPath){
        this.deffaultPath = deffaultPath
    }

    set = (file, type = 'deffault', userPath) => {
        let dirPath = userPath
        
        if(!dirPath)
            dirPath = geterateAndCheck('directory', this.deffaultPath, true)
        
        const filePath = geterateAndCheck(type, dirPath)

        try{
            fs.writeFileSync(filePath, file, 'binary')
            return {filePath, dirPath}
        }catch(e){
            throw e
        }        
    }
    get = (path) => {
        try{
            return fs.readFileSync(path)
        }catch(e){
            throw e
        }
    }
    delete =  (path) => {
        try{
            fs.unlinkSync(path);
            return {status : 'ok'}
        }catch(e){
            console.log(e);
            return({status : 'problem with delete'})
        }
    }
    update = (path, file) => {
        try{
            fs.writeFileSync(path, file, 'binary')
            return {status : 'ok'}
        }catch(e){
            console.log(e);
            return({status : 'problem with update'})
        }
    }
}

module.exports = Storager