const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const botRouter = require('./routes/bot');
const usersRouter = require('./routes/users');
const positionsRouter = require('./routes/positions');

const app = express();
app.use(logger('dev'));
app.use((req, res, next) => {
  console.log('Called URL:', req.url);
  next();
});
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/positions', positionsRouter);
app.use('/bot', botRouter);

module.exports = app;
