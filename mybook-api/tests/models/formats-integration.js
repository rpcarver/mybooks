/**
 * @file formats-formats-tests.js
 * Provides tests for the formats sequelize format
 *
 * @format Randy Carver
 * @date 7/1/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
require('../../config/env');
const chai = require('chai');
const orm = require('../../models/orm');

const expect = chai.expect;

const paramGoodBookOne = {
  title: 'Book Number One',
  publisherID: null,
  ISBN: 1234567890,
  printingYear: 1976,
  printingNum: null,
  formatID: null,
  rating: 10,
  locationName: 'test',
  notes: 'This is a short note...',
};

async function clearDb() {
  expect(orm).to.have.property('formats');
  // drops the tables imported into the db and recreates them
  await orm.sequelize.sync({ force: true });
}


describe('model - format - create and select one', async () => {
  beforeEach(async () => {
    await clearDb();
  });

  it('should create an format and be able to select it', async () => {
    const format = await orm.formats.create(
      { formatName: 'trade paperback', description: 'boogly boo \' \\ # ~' });
    expect(format.formatID).to.equal(1);
    const checkFormat = await orm.formats.findById(format.formatID);
    expect(checkFormat.firstName).to.equal(format.firstName);
    expect(checkFormat.lastName).to.equal(format.lastName);
  });
});

describe('model - format - validate', async () => {
  beforeEach(async () => {
    await clearDb();
  });

  it('should error if name is too long', async () => {
    let errorObj = null;
    const nameTooLong = 'pipsqueak '.repeat(5);
    const descriptionTooLong = 'pipsqueak '.repeat(51);

    const format = await orm.formats.build(
      { formatName: nameTooLong, description: descriptionTooLong });
    await format.validate()
      .catch((e) => { errorObj = e; });

    expect(errorObj, 'validate should have produced an error').to.not.be.null;
    expect(errorObj, 'error object doesn\'t have the expected properties').to.have.property('errors');
    expect(errorObj.errors, 'not the correct number of errors').to.have.lengthOf(2);
  });
});

describe('model - format - relationships', async () => {
  beforeEach(async () => {
    await clearDb();
  });

  it('should delete the format and relationship but not the related books (n..n)', async () => {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    const format = await orm.formats.create(
      { formatName: 'trade paperback', description: 'boogly boo \' \\ # ~' });
    await book.setFormat(format);

    let checkFormat = await orm.formats.findById(1);
    expect(checkFormat.dataValues).to.deep.equal(format.dataValues);
    await format.destroy();
    checkFormat = await orm.formats.findById(1);
    expect(checkFormat).is.null;
    book = await orm.books.findById(1);
    expect(book).is.not.null;
  });
});

