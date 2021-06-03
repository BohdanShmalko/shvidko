const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let line = 1;
const message = (question) =>
  new Promise((resolve, reject) => {
    rl.question('⌛️' + question, (data) => {
      console.log(`\x1b[${line};0H` + '✅ ' + question + data);
      line++;
      resolve(data);
    });
  });

const messageReplace = async (question) => {
  const value = await message(question);
  return value.replace(/\s/g, '');
};

const messageYN = async (question, defValue = 'n') => {
  let value = await message(`${question} (y/n)? (${defValue}) : `);
  if (defValue === 'y' && !value) return true;
  else if (defValue === 'n' && !value) return false;

  if (value === 'n' || value === 'not') return false;
  else if (value === 'y' || value === 'yes') return true;
  else throw `The '${value}' is not y or n`;
};

const messageLoop = async (questionYN, question, defName = '', arr = []) => {
  let want = await messageYN(questionYN);
  if (want) {
    let defValue = defName + arr.length;
    let brackets = '';
    if (defName) brackets = `(${defValue})`;
    let currentQuestion = `${question} ${brackets} : `;
    let value = await messageReplace(currentQuestion);
    if (!value) value = defValue;
    let newArr = [...arr, value];
    return await messageLoop(questionYN, question, defName, newArr);
  } else return arr;
};

const close = () => rl.close();

module.exports = { message, messageYN, messageReplace, messageLoop, close };
