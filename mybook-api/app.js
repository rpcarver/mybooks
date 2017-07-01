/* eslint-disable import/no-extraneous-dependencies,jsx-a11y/href-no-hash,prefer-arrow-callback */
/**
 * Created by rcarver on 6/26/17.
 */
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
