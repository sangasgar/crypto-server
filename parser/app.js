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

const { PORT } = process.env || 3011;

const app = express();
// const startBot = async () => {
//   await playBot();
//   const position = storage.getItem('Position');
//   if (position === undefined || position === 'long' || position === 'flat') {
//     await logicTradingLongBybit();
//   }
//   if (position === undefined || position === 'short' || position === 'flat') {
//     await logicTradingShortBybit();
//   }
// };
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
app.listen(PORT, () => {
  console.log('Server запущен на порту ', PORT);
});
// setInterval(async () => {
//   const position = storage.getItem('Position');
//   await playBot();
//   if (position === undefined || position === 'long' || position === 'flat') {
//     await logicTradingLongBybit();
//   }
//   if (position === undefined || position === 'short' || position === 'flat') {
//     await logicTradingShortBybit();
//   }
// }, 60000);
module.exports = app;
