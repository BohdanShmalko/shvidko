const create = require('./create');

const example = create(__dirname + '/');
const testDir = example.createDir('test');
testDir.createFile('result', `${__dirname}/templates/test.jst`, {
  loops: [
    [
      ['hi11', 'hi12'],
      ['hi21', 'hi22'],
    ],
  ],
  conditions: [
    { status: true, params: ['cond'] },
    { status: false, params: ['cond'] },
  ],
  params: ['variable1', 'variable2', 'variable3'],
});
