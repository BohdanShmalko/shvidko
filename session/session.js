const Client = require('./client'),
      SessionClient = require('./deffaultSessionClient')
      fs = require('fs')

const TOKEN_LENGTH = 100,
      ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz',
      ALPHA = ALPHA_UPPER + ALPHA_LOWER,
      DIGIT = '0123456789',
      ALPHA_DIGIT = ALPHA + DIGIT

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  let key = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = Math.floor(Math.random() * base);
    key += ALPHA_DIGIT[index];
  }
  return key;
}

class Sesion {
    constructor(req, res, sessionTime, sessionsPath){
        this.client = new Client(req, res, sessionTime)
        this.sessionClient = SessionClient
        sessionsPath[sessionsPath.length-1] == '/' ? this.path = sessionsPath : this.path = sessionsPath+'/'
        sessionTime !== null ? this.time = sessionTime * 1000 : this.time = null
        this.token = null
        this.initial()
    }

    async initial() {
        this.client.parseCookie()
        if(!this.client.cookie.token) {
            this.token = generateToken()
            this.client.setCookie('token', this.token)
            let result = this.client.sendCookie()
            if(result) await this.sessionClient.create(this.token, this.path)
                .then(setTimeout(() => this.time && this.sessionClient.delete(this.token, this.path), this.time)) 
            else 
            console.log('\x1b[33m%s\x1b[0m', "WARNING : Session creation failed, check the CORS policy settings (you may need to change the settings in standartHeaders)"); 
        }else this.token = this.client.cookie.token     
    }

    get() {
        return this.sessionClient.get(this.token, this.path)
    }

    async set(data){
        await this.sessionClient.set(this.token, data, this.path)
    }
    end(){
        this.client.sendCookie()
    }
}

module.exports = Sesion;