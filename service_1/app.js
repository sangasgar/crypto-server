const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const db = require('./db/models');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const { PORT } = process.env;
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

async function dbConnect() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
dbConnect();
app.listen(PORT, () => {
  console.log('start server ', PORT);
});
module.exports = app;
