const Client = require('./client');
const SessionClient = require('./deffaultSessionClient');
const generateToken = require('../generator');
const logger = require('../loger');

class Session {
  status = 'deleted';

  constructor(req, res, sessionTime, sessionsPath, sessionClient) {
    !sessionClient
      ? (this.sessionClient = new SessionClient(sessionsPath))
      : (this.sessionClient = new sessionClient(sessionsPath));
    sessionTime && (this.time = sessionTime * 1000);
    this.client = new Client(req, res, this.time);
    this.isExistToken();
  }

  create(inf = {}) {
    this.token = generateToken();
    this.client.setCookie('token', this.token);
    let result = this.end();
    if (result)
      this.sessionClient
        .create(this.token, inf)
        .then(() => {
          this.status = 'created';
          setTimeout(() => {
            this.time && this.status === 'created' && this.delete();
          }, this.time);
        })
        .catch((err) => {
          logger.warning('Could not create session file', err);
        });
    else
      logger.warning(
        'Session creation failed, check the CORS policy settings (you may need to change the settings in middleware cors)'
      );
  }

  isExistToken() {
    this.client.parseCookie();
    if (this.client.cookie.token) {
      this.token = this.client.cookie.token;
      return true;
    }
    return false;
  }

  get() {
    return this.sessionClient.get(this.token).catch((err) => {
      logger.warning('Could not read information from the session', err);
    });
  }

  set(data) {
    this.sessionClient.set(this.token, data).catch((err) => {
      logger.warning('Could not add information to session', err);
    });
  }

  async delete() {
    this.status = 'deleted';
    this.client.deleteCookie('token');
    await this.sessionClient.delete(this.token).catch((err) => {
      logger.warning('Could not delete session', err);
    });
    this.end();
  }

  end() {
    return this.client.sendCookie();
  }
}

module.exports = Session;
