/**
 * @file orm.js
 * Provides a single object to access the sequelized database and its models.
 *
 * @author Randy Carver
 * @date 7/1/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
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

orm.authors = sequelize.import('./authors.js');
orm.books = sequelize.import('./books.js');
orm.book_authors = sequelize.import('./books_authors.js');
orm.formats = sequelize.import('./formats.js');
orm.locations = sequelize.import('./locations.js');
orm.publishers = sequelize.import('./publishers.js');

// Associate the models
Object.keys(orm).forEach((modelName) => {
  if (orm[modelName].associate) {
    orm[modelName].associate(orm);
  }
});

orm.Sequelize = Sequelize;
orm.sequelize = sequelize;

module.exports = orm;
