const express = require('express');
const chalk = require('chalk');
const path = require('path');
const apiRouter = require('./api/index');
const { readJSON } = require('../db');

const whiteListedUrl = process.env.WHITELISTED_URL || '*';

const customCORSMiddleware = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', whiteListedUrl);
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  next();
};

const app = express();

// Allow parsing of json in req.body
app.use(express.json());
// Allow cors requests - configured slightly with env variables
app.use(customCORSMiddleware);
// Statically serve webpacks built files
app.use(express.static(path.join(__dirname, '../../dist')));
// Include an express router to extend upon
// app.use('/api', apiRouter);

// const app = express();

// app.use(express.static(path.join(__dirname, '../dist')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
})

app.get('/api/products', (req, res) => {
  readJSON(path.join(__dirname,'../products.json'))
  .then(data => {
    res.send(data);
  });
})

const startServer = (port, prod) =>
  new Promise((res) => {
    app.listen(port, () => {
      console.log(
        chalk.green(
          `Application is now listening on PORT:${port} and allowing the following sites to communicate with us: ${whiteListedUrl}`
        )
      );
      res();
    });
  });

module.exports = startServer;
