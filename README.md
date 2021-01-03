![Shvidko Logo](https://i.ibb.co/YWf1Dkq/shvidko-logo.png)

  Lightweight and fast http server with built-in sessions, file storage and more

```js
const {Shvidko} = require('shvidko)

const app = new Shvidko().listen(3001)

app.get('/', (req, res) => {
  res.send('Hello World')
})
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install shvidko
```

## Features

  * Robust routing
  * Focus on high performance
  * Content negotiation
  * Executable for generating applications quickly
  * Built-in session support
  * Built-in file storage support
  * Encapsulation requests

## Examples

  To view the examples, clone the Shvidko repo and install the dependencies:

```bash
$ git clone https://github.com/BohdanShmalko/shvidko.git
$ cd shvidko
$ npm install
```

Then run the example

```bash
$ npm test
```

## License

  [MIT](LICENSE)