/* eslint-disable jsx-a11y/href-no-hash */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = require('../config/env');

const orm = {};

// connect to the database.
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  pool: {
    max: env.DATABASE_POOL_MAX,
    min: env.DATABASE_POOL_MIN,
    idle: env.DATABASE_POOL_IDLE,
  },
  define: {
    timestamps: false,
  },
  logging: env.DATABASE_QUERY_LOGGING,
});

// Import the models
fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'orm.js') && (file.slice(-3) === '.js'))
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    orm[model.name] = model;
});

// Associate the models
Object.keys(orm).forEach((modelName) => {
  if (orm[modelName].associate) {
    orm[modelName].associate(orm);
  }
});


orm.sequelize = sequelize;
orm.Sequelize = Sequelize;

module.exports = orm;
