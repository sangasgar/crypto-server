const express = require('express');

require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const { PORT } = process.env || 3011;
const app = express();

app.use(logger('dev'));

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.listen(PORT, () => {
  console.log('Server запущен на порту ', PORT);
});
module.exports = app;
