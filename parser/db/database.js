require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'garegin',
    password: '123',
    database: 'service_1',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'garegin',
    password: '123',
    database: 'service_1',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
