/**
 * @file authors-models-tests.js
 * Provides tests for the authors sequelize model
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


describe('model - author - create and select one', () => {
  beforeEach(async () => {
    expect(orm).to.have.property('authors');
    // drops the tables imported into the db and recreates them
    await orm.sequelize.sync({ force: true });
  });

  it('should create an author and be able to select it', async () => {
    const author = await orm.authors.create({ lastName: 'Fred', firstName: 'Flintstone' });
    expect(author.authorID).to.equal(1);
    const checkAuthor = await orm.authors.findById(author.authorID);
    expect(checkAuthor.firstName).to.equal(author.firstName);
    expect(checkAuthor.lastName).to.equal(author.lastName);
  });
});

describe('model - author - validate', async () => {
  beforeEach(async () => {
    expect(orm).to.have.property('authors');
    // drops the tables imported into the db and recreates them
    await orm.sequelize.sync({ force: true });
  });

  it('should error if name is too long', async () => {
    let errorObj = null;
    const nameTooLong = 'pipsqueak '.repeat(11);

    const author = await orm.authors.build({ lastName: nameTooLong, firstName: nameTooLong });
    await author.validate()
      .catch((e) => { errorObj = e; });

    expect(errorObj, 'validate should have produced an error').to.not.be.null;
    expect(errorObj, 'error object doesn\'t have the expected properties').to.have.property('errors');
    expect(errorObj.errors, 'not the correct number of errors').to.have.lengthOf(2);
  });
});

describe('model - author - relationships', async () => {
  beforeEach(async () => {
    expect(orm).to.have.property('authors');
    // drops the tables imported into the db and recreates them
    await orm.sequelize.sync({ force: true });
  });

  it('should delete the author and relationship but not the related books (n..n)', async () => {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    const author = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    await book.addAuthor(author, { through: orm.book_authors, save: true });

    let checkAuthor = await orm.authors.findById(1);
    expect(checkAuthor.dataValues).to.deep.equal(author.dataValues);
    await author.destroy();
    checkAuthor = await orm.authors.findById(1);
    expect(checkAuthor).is.null;
    book = await orm.books.findById(1);
    expect(book).is.not.null;
  });
});

