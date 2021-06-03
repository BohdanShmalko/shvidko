#!/usr/bin/env node

const Flag = require('../init/flag');
const create = require('../init/create');
const ci = require('../init/ci');
const logger = require('../lib/loger');

const flag = new Flag();
const DEFAULT_NAME = 'shvidko-app';
const DEFAULT_PATH = './';
const DEFAULT_PORT = 3001;

let name = flag.add(
  'name',
  DEFAULT_NAME,
  'name of your future shvidko application'
);
let path = flag.add(
  'path',
  DEFAULT_PATH,
  'path where to create an application'
);
let port = flag.add('port', DEFAULT_PORT, 'port for your future application');
let def = flag.add('def', false, 'default options for creating app');

flag.complete();

const main = (async () => {
  console.clear();
  let options = {
    name: name.value,
    path: path.value,
    port: port.value,
    useDB: false,
    sessions: false,
    fileStorage: false,
    secure: false,
    API: {},
  };

  if (def.value === false) options = await ci(name, path, port);

  const creator = create(options.path);
  const app = creator.createDir(options.name);

  const src = app.createDir('src');
  const API = src.createDir('API');

  const routsNames = [];
  const routsRequire = [];
  for (let rout in options.API) {
    let routDir;
    if (rout === 'mainApp') {
      routsRequire.push([rout, options.path + 'src/API/API']);
      routDir = API;
    } else {
      routsNames.push([rout]);
      routsRequire.push([rout, options.path + 'src/API/' + rout + '/API']);
      routDir = API.createDir(rout);
    }

    const endPointsNames = [];
    options.API[rout].forEach((name) => {
      endPointsNames.push([name]);
      routDir.createFile(name, `${__dirname}/../init/templates/requests.jst`, {
        params: [name],
      });
    });

    routDir.createFile('API', `${__dirname}/../init/templates/api.jst`, {
      loops: [endPointsNames, endPointsNames],
    });
  }

  app.createFile('app', `${__dirname}/../init/templates/app.jst`, {
    loops: [routsRequire, routsNames],
    conditions: [
      {
        status: !!options.secure,
        params: [
          options.secure && options.secure.key,
          options.secure && options.secure.cert,
        ],
      },
      {
        status: !!options.fileStorage,
        params: [!!options.fileStorage && options.fileStorage.path],
      },
      { status: !!options.useDB, params: [] },
      {
        status: !!options.sessions,
        params: [
          !!options.sessions && options.sessions.time,
          !!options.sessions && options.sessions.path,
        ],
      },
    ],
    params: [options.port],
  });

  logger.log(
    `Enter "node ${options.path}${options.name}/app.js" in console to run server`
  );
  process.exit(0);
})();
