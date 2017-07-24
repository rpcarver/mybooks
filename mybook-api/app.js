/**
 * @file app.js
 * Provides node listening and setup for the MyBooks RESTful API
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
const restify = require('restify');
const env = require('./config/env');
const orm = require('./models/orm');
const booksController = require('./controllers/books-controller')(orm);
const logger = require('./utils/logger');


const app = restify.createServer();
app.get('/books', booksController.getAll);

app.listen(env.API_PORT, () => {
  orm.sequelize.authenticate()
    .then(() => {
      logger.info('DB Connection Established');
    })
    .catch((err) => {
      logger.error('DB Connection Failed: ', err);
      process.exit(1);
    });
  logger.info(`app listening at port ${env.API_PORT} for ${env.NODE_ENV} environment.`);
});

