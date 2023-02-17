// express 4 still not support promise: https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const _ = require('lodash');
const helmet = require('helmet');

// src
const initRoute = require('src/routes/entry');

// middleware
const errorHandler = require('server/main/middleware/errorHandler');
const resHandler = require('server/main/middleware/resHandler');

const app = express();

app.use(resHandler);
app.use(cors());
app.use(helmet.default());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

initRoute(app);
app.use(errorHandler);

// final
app.use('*', (req, res) => res.status(404).send({
  ok: false,
  msg: 'route not fount',
  error: {
    code: 404,
    debugInfo: { uri: _.get(req, 'originalUrl') },
  },
}));

module.exports = app;
