/**
 * @file books-controller.js
 * Provides
 *
 * @author Randy Carver
 * @date 7/21/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/

// const orm = require('../models/orm');
const errors = require('restify-errors');
const logger = require('../utils/logger');

module.exports = function booksController(orm) {
  return {
    getAll: (req, res, next) => {
      orm.books.findAll({ include: [orm.publishers, orm.formats, orm.authors] })
        .then((result) => {
          res.status(200);
          res.json(result);
          return next();
        })
        .catch((error) => {
          logger.error(`books.findAll error: ${error}`);
          return next(new errors.InternalError('Error retrieving all books'));
        });
    },
    getById: (req, res, next) => {
      orm.books.findById(req.params.id, { include: [{ all: true }] })
        .then((result) => {
          if (result === null) {
            return next(new errors.ResourceNotFoundError(`Book: ${req.params.id} not found`));
          }
          res.status(200);
          res.json(result);
          return next();
        })
        .catch((error) => {
          logger.error(`books error: ${error}`);
          return next(new errors.InternalError('Error retrieving one book'));
        });
    },
  };
};
