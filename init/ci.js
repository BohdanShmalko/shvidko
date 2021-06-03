const readConsole = require('./readConsole');
const fs = require('fs');

const DEFAULT_NAME = 'shvidko-app';
const DEFAULT_PATH = './';
const DEFAULT_PORT = 3001;

module.exports = CI = async (name, path, port) => {
  const options = {
    name: name.value,
    path: path.value,
    port: port.value,
    sessions: false,
    fileStorage: false,
    secure: false,
    API: {},
  };

  console.clear();

  if (name.value === DEFAULT_NAME) {
    const rlName = await readConsole.messageReplace(
      `App name (${name.value}) : `
    );
    if (rlName) options.name = rlName;
  }

  if (path.value === DEFAULT_PATH) {
    const rlPath = await readConsole.messageReplace(
      `App path (${path.value}) : `
    );
    if (rlPath) options.path = rlPath;
  }

  if (port.value === DEFAULT_PORT) {
    const appPort = await readConsole.messageReplace(
      `App port (${port.value}) : `
    );
    if (appPort) options.port = appPort;
  }

  options.useDB = await readConsole.messageYN('Do you want use database', 'n');

  const useSession = await readConsole.messageYN('Do you want use session');
  if (useSession) {
    let time = await readConsole.messageReplace(
      '   Enter the lifetime of the session (null === Infinity) : '
    );
    if (!time) time = null;
    let path = await readConsole.messageReplace(
      '   Enter the path where the sessions will be stored (./sessions) : '
    );
    if (!path) path = './sessions';
    options.sessions = { time, path };
  }

  const useFileStorage = await readConsole.messageYN(
    'Do you want use file storage'
  );
  if (useFileStorage) {
    let path = await readConsole.messageReplace(
      '   Enter the path where the files will be stored (./files) : '
    );
    if (!path) path = './files';
    options.fileStorage = { path };
  }

  const useSecure = await readConsole.messageYN(
    'Do you want use file secure protocol'
  );
  if (useSecure) {
    let key = await readConsole.messageReplace(
      '   Enter path to your key.pem file (not use secure protocol) : '
    );
    if (key && fs.existsSync(key)) {
      let cert = await readConsole.messageReplace(
        '   Enter path to your cert.pem file (not use secure protocol) : '
      );
      if (cert && fs.existsSync(cert)) options.secure = { key, cert };
    }
  }

  const routes = ['mainApp'];
  routes.push(
    ...(await readConsole.messageLoop(
      'Do you want create new subroute for main app',
      'Write subroute name',
      'subroute'
    ))
  );

  for (let i = 0; i < routes.length; i++) {
    options.API[routes[i]] = await readConsole.messageLoop(
      `Do you want create new API page for ${routes[i]}`,
      '   Write page name',
      routes[i]
    );
  }

  readConsole.close();
  return options;
};
