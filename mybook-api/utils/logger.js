/**
 * @file logging.js
 * Provides logging services
 *
 * @author Randy Carver
 * @date 7/20/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
const pino = require('pino');
const env = require('../config/env');
const pjson = require('../package.json');

const logger = pino({
  name: pjson.name,
});

/*
 * 10 - trace
 * 20 - debug
 * 30 - info
 * 40 - warn
 * 50 - error
 * 60 - fatal
 */
logger.addLevel('sql', 15);
logger.level = env.LOGGING_LEVEL;

module.exports = logger;
