/**
 * @file init-dev-db.js
 * Provides a script to truncate the db and initialize with some data
 *
 * @author Randy Carver
 * @date 7/23/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
const orm = require('../models/orm');

async function createAllData() {
  // drop all tables and recreate
  await orm.sequelize.sync({ force: true });

  await orm.locations.bulkCreate([
    { locationName: 'location1', description: 'dev location 1' },
    { locationName: 'location2', description: 'dev location 2' },
  ]);
  await orm.formats.bulkCreate([
    { formatName: 'format1', description: 'dev format 1' },
    { formatName: 'format2', description: 'dev format 2' },
  ]);
  await orm.authors.bulkCreate([
    { firstName: 'John', lastName: 'Smith' },
    { firstName: 'Ursala', lastName: 'LeGuin' },
    { firstName: 'Anne', lastName: 'McCaffrey' },
    { firstName: 'Spider', lastName: 'Robinson' },
  ]);
  await orm.publishers.bulkCreate([
    { publisherName: 'Baen Books' },
    { publisherName: 'Ballantine Books' },
    { publisherName: 'Ace Books' },
    { publisherName: 'Gnome Press' },
  ]);
  await orm.books.bulkCreate([
    {
      title: 'Book One',
      publisherID: 1,
      ISBN: 1234567890,
      printingYear: 1976,
      printingNum: null,
      formatID: 1,
      rating: 10,
      locationName: 'location1',
      notes: 'This is a short note...',
    }, {
      title: 'Book Two',
      publisherID: 1,
      ISBN: 1234567890,
      printingYear: 1999,
      printingNum: null,
      formatID: 1,
      rating: 10,
      locationName: 'location1',
      notes: 'It was a dark and stormy night...',
    }, {
      title: 'Book Three',
      publisherID: 2,
      ISBN: 1234567890,
      printingYear: 2017,
      printingNum: null,
      formatID: 2,
      rating: 10,
      locationName: 'location2',
      notes: 'Meanwhile, our intrepid hero...',
    },
  ]);
}

// noinspection JSIgnoredPromiseFromCall
createAllData();
// eslint-disable-next-line no-console
console.log('done loading data!');
process.exit(0);

