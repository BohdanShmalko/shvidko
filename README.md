![Shvidko Logo](https://i.ibb.co/YWf1Dkq/shvidko-logo.png)

  Lightweight and fast http server with built-in sessions, file storage and more

```js
const shvidko = require("shvidko");

const app = shvidko.createServer().listen(3001);
app.use(shvidko.middleware.sender()); // to use res.send (send data to the client)

// url : http://localhost:3001/
app.get("/", (req, res) => {
    res.send("Hello world!");
});
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

## Fast start

```bash
$ npx shvidko
```
OR
```bash
$ node ./node_modules/shvidko/bin/shvidko -path "./"
```

## Features

  * Robust routing
  * Focus on high performance
  * Content negotiation
  * Executable for generating applications quickly
  * Built-in session support
  * Built-in file storage support
  * Encapsulation requests
  * Support for middleware
  * Examples for different cases

## Examples

  To view the examples, clone the Shvidko repo and install the dependencies:

```bash
$ git clone https://github.com/BohdanShmalko/shvidko.git
$ cd shvidko
$ npm install
$ cd examples
```

Then run the one of examples

```bash
$ node simple
$ node complex 
$ node cors 
$ node database 
$ node fileStorage 
$ node parsers 
$ node requestsFromAnotherFile 
$ node secure 
$ node sessions 
$ node subrouters 
```

## License

  [MIT](LICENSE)