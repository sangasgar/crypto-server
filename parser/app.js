const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const storage = require('./storage/storage');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const playBot = require('./middleWare/apiBybit');
const usersRouter = require('./routes/users');
const logicTradingLongBybit = require('./logic/logicTradingLongBybit');
const logicTradingShortBybit = require('./logic/logicTradingShortBybit');

const { PORT } = process.env || 3011;

const app = express();
const startBot = async () => {
  await playBot();
  const position = storage.getItem('Position');
  await playBot();
  if (position === undefined || position === 'long' || position === 'flat') {
    await logicTradingLongBybit();
  }
  if (position === undefined || position === 'short' || position === 'flat') {
    await logicTradingShortBybit();
  }
};
app.use(logger('dev'));
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
startBot();
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.listen(PORT, () => {
  console.log('Server запущен на порту ', PORT);
});
setInterval(async () => {
  const position = storage.getItem('Position');
  await playBot();
  if (position === undefined || position === 'long' || position === 'flat') {
    await logicTradingLongBybit();
  }
  if (position === undefined || position === 'short' || position === 'flat') {
    await logicTradingShortBybit();
  }
}, 25000);
module.exports = app;
