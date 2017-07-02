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
const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto('mybooks', 'root', 'your_password_here', {
  host: 'localhost',
  dialect: 'mysql',
  port: '3306',
  additional: {
    timestamps: false,
  },
});

auto.run(function run(err) {
  if (err) throw err;
});
