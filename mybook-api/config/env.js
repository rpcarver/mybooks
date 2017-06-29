/**
 * Created by rcarver on 6/27/17.
 */
const dotenv = require('dotenv');

if (process.env.DOTENV_LOADED !== 'true') {
  let envPath = null;
  switch (process.env.NODE_ENV) {
    case 'test': {
      envPath = { path: './config/.env.test' };
      break;
    }
    case 'development':
    default : {
      envPath = { path: './config/.env.dev' };
      break;
    }
  }
  dotenv.config(envPath);
  process.env.DOTENV_LOADED = true;
}

const env = {
  /*
   Set NODE_ENV as part of the task so its loaded BEFORE the env files are processed.
   e. g.
   "scripts": {
     "tests": "NODE_ENV=tests mocha"
     "start": "NODE_ENV=development node app.js"
   },
  */
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_NAME: process.env.DATABASE_NAME || 'mybooks',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || 3306,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'mysql',
  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX || 10,
  DATABASE_POOL_MIN: process.env.DATABASE_POOL_MIN || 1,
  DATABASE_POOL_IDLE: process.env.DATABASE_POOL_IDLE || 5000,
  DATABASE_QUERY_LOGGING: process.env.DATABASE_QUERY_LOGGING || false,
  API_VERSION: process.env.API_VERSION || 1.0,
  API_NAME: process.env.API_NAME || 'mybook-api',
  API_PORT: process.env.API_PORT || 8080,
};

module.exports = env;
