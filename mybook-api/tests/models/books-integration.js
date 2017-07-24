/* eslint-disable prefer-arrow-callback,func-names,prefer-const */
/**
 * @file books-models-tests.js
 * Provides partial integrations tests for the books sequelize model
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

const expect = chai.expect;


const orm = require('../../models/orm');

const paramMissingRequiredFields = {
  ISBN: 1234567890,
  printingYear: 1976,
  printingNum: null,
  rating: 10,
  notes: 'This is a short note...',
};

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

const paramBadFields = {
  title: 'Book Number One',
  ISBN: 'foo',
  printingYear: 'foo',
  printingNum: 'foo',
  rating: 'foo',
  locationName: 'home',
  notes: 'This is a short note...',
};

async function bookBefore() {
  expect(orm).to.have.property('books');
  // drops the tables imported into the db and recreates them
  await orm.sequelize.sync({ force: true });
  // don't catch the error, it should fail the test if it fails.
}

describe('model - book - creation', function () {
  beforeEach(bookBefore);

  it('should create a book when valid data and relationships are set', async function () {
    let book = orm.books.build(paramGoodBookOne);
    const location = await orm.locations.create({ locationName: 'test' });
    await book.setLocation(location, { save: false });
    await book.save();

    const checkBook = await orm.books.findById(1);
    expect(checkBook.dataValues).to.deep.equal(book.dataValues);
  });

  it('should create two books given identical information barring bookID', async function () {
    await orm.locations.create({ locationName: 'test' });
    let bookOne = await orm.books.create(paramGoodBookOne);
    let bookTwo = await orm.books.create(paramGoodBookOne);

    expect(bookOne.bookID).to.equal(1);
    expect(bookTwo.bookID).to.equal(2);

    bookOne = await orm.books.findById(bookOne.bookID);
    bookTwo = await orm.books.findById(bookTwo.bookID);

    expect(bookOne.title).to.equal(bookTwo.title);
    expect(bookOne.ISBN).to.equal(bookTwo.ISBN);
    expect(bookOne.printingYear).to.equal(bookTwo.printingYear);
    expect(bookOne.printingNum).to.equal(bookTwo.printingNum);
    expect(bookOne.rating).to.equal(bookTwo.rating);
    expect(bookOne.notes).to.equal(bookTwo.notes);
    expect(bookOne.locationName).to.equal(bookTwo.locationName);
  });

  it('should return all errors and not create a book when nonstring fields are set with incompatible data types', async function () {
    let errorObj = null;

    await orm.books.create(paramBadFields)
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj).has.property('errors');
    expect(errorObj.errors).has.lengthOf(4);
    expect(errorObj.errors[0].path).equals('ISBN');
    expect(errorObj.errors[0].type).equals('Value Type Violation');
    expect(errorObj.errors[1].path).equals('printingYear');
    expect(errorObj.errors[1].type).equals('Value Type Violation');
    expect(errorObj.errors[2].path).equals('printingNum');
    expect(errorObj.errors[2].type).equals('Value Type Violation');
    expect(errorObj.errors[3].path).equals('rating');
    expect(errorObj.errors[3].type).equals('Value Type Violation');
    const checkBook = await orm.books.findById(1);
    expect(checkBook).to.equal(null);
  });

  it('should return all errors when required fields and relationships are not set - missing title and location', async function () {
    let errorObj = null;

    let book = await orm.books.create(paramMissingRequiredFields)
      .catch((e) => {
        errorObj = e;
      });
    expect(book).is.undefined;
    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj).has.property('errors');
    expect(errorObj.errors).has.lengthOf(2);
    expect(errorObj.errors[0].path).equals('title');
    expect(errorObj.errors[0].type).equals('notNull Violation');
    expect(errorObj.errors[1].path).equals('locationName');
    expect(errorObj.errors[1].type).equals('notNull Violation');
    const checkBook = await orm.books.findById(1);
    expect(checkBook).to.equal(null);
  });
});

describe('model - validate a book', function () {
  before(function () {
    expect(orm).to.have.property('books');
    // we do not need a connection to validate
  });
  it('should be valid if the title and the location relationships are set', async function () {
    let errorObj = null;

    // eslint-disable-next-line prefer-const
    let book = orm.books.build(paramGoodBookOne);
    await book.validate()
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.null;
  });

  it('should be invalid if the title and the location relationships are not set', async function () {
    let errorObj = null;

    // eslint-disable-next-line prefer-const
    let book = orm.books.build(paramMissingRequiredFields);
    await book.validate()
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj).has.property('errors');
    expect(errorObj.errors).has.lengthOf(2);
    expect(errorObj.errors[0].path).equals('title');
    expect(errorObj.errors[0].type).equals('notNull Violation');
    expect(errorObj.errors[1].path).equals('locationName');
    expect(errorObj.errors[1].type).equals('notNull Violation');
  });

  it('should be invalid if all nonstring fields are set with incompatible data types', async function () {
    let errorObj = null;

    // eslint-disable-next-line prefer-const
    let book = orm.books.build(paramBadFields);
    await book.validate()
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj).has.property('errors');
    expect(errorObj.errors).has.lengthOf(4);
    expect(errorObj.errors[0].path).equals('ISBN');
    expect(errorObj.errors[0].type).equals('Value Type Violation');
    expect(errorObj.errors[1].path).equals('printingYear');
    expect(errorObj.errors[1].type).equals('Value Type Violation');
    expect(errorObj.errors[2].path).equals('printingNum');
    expect(errorObj.errors[2].type).equals('Value Type Violation');
    expect(errorObj.errors[3].path).equals('rating');
    expect(errorObj.errors[3].type).equals('Value Type Violation');
  });

  it('should be invalid if the title is longer than 100 chars, or the note is longer than 500', async function () {
    let errorObj = null;

    // eslint-disable-next-line prefer-const
    let book = orm.books.build(paramGoodBookOne);
    book.title = 'pipsqueak '.repeat(11);
    book.notes = 'pipsqueak '.repeat(51);

    await book.validate()
      .catch((e) => { errorObj = e; });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj).has.property('errors');
    expect(errorObj.errors).has.lengthOf(2);
    expect(errorObj.errors[0].path).equals('title');
    expect(errorObj.errors[0].type).equals('Validation error');
    expect(errorObj.errors[1].path).equals('notes');
    expect(errorObj.errors[1].type).equals('Validation error');
  });
});

describe('model - book - deletion', function () {
  beforeEach(bookBefore);

  it('should delete the book but not the location (1..n)', async function () {
    let location = await orm.locations.create({ locationName: 'test' });
    let book = orm.books.build(paramGoodBookOne);
    book.locationName = null;
    await book.setLocation(location, { save: false });
    await book.save();

    let checkBook = await orm.books.findById(1);
    expect(checkBook.dataValues).to.deep.equal(book.dataValues);
    await book.destroy();
    checkBook = await orm.books.findById(1);
    expect(checkBook).is.null;
    location = orm.locations.findById('temp');
    expect(location).is.not.null;
  });

  it('should delete the book and relationship but not the related authors (n..n)', async function () {
    let location = await orm.locations.create({ locationName: 'test' });
    let author = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });

    let book = orm.books.build(paramGoodBookOne);
    await book.setLocation(location, { save: false });
    await book.save();

    await book.addAuthor(author, { through: orm.book_authors, save: true });

    let checkBook = await orm.books.findById(1);
    expect(checkBook.dataValues).to.deep.equal(book.dataValues);
    await book.destroy();
    checkBook = await orm.books.findById(1);
    expect(checkBook).is.null;
    author = await orm.authors.findById(1);
    expect(author).is.not.null;
  });
});

describe('model - book - author relationship', function () {
  beforeEach(bookBefore);

  it('should add an author given a valid author', async function () {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let author = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    await book.addAuthor(author, { through: orm.book_authors, save: true });

    let checkBook = await orm.books.findById(1);// , { include: [{ all: true }] });
    expect(checkBook.dataValues).deep.equals(book.dataValues);
    expect(checkBook).to.not.be.null;

    await book.destroy();

    checkBook = await orm.books.findById(1);
    expect(checkBook).is.null;
    let checkAuthor = await orm.authors.findById(1);
    expect(checkAuthor).is.not.null;
    expect(checkAuthor.dataValues).deep.equals(author.dataValues);
  });

  it('should not add an author given an invalid author', async function () {
    let errorObj = null;

    await orm.locations.create({ locationName: 'test' });
    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let author = orm.authors.build({ authorID: -1, lastName: 'Hombre', firstName: 'Bad' });
    await book.addAuthor(author, { through: orm.book_authors, save: true })
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeForeignKeyConstraintError');
    expect(errorObj.index).equals('authorID');
  });

  it('should not add an author if the author is already associated to the book', async function () {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let author = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    await book.addAuthor(author, { save: true });
    await book.addAuthor(author, { save: true });
    const authorCount = await book.countAuthors();
    expect(authorCount).to.equal(1);

    let authors = await orm.authors.findAll();
    expect(authors).lengthOf(1);
    expect(authors[0].authorID).to.equal(author.authorID);
    expect(authors[0].lastName).to.equal(author.lastName);
    expect(authors[0].firstName).to.equal(author.firstName);
  });

  it('should add multiple authors given valid authors', async function () {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let authorOne = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    let authorTwo = await orm.authors.create({ lastName: 'Sangiacomo', firstName: 'Ken' });
    let authorThree = await orm.authors.create({ lastName: 'Muir', firstName: 'Bill' });
    await book.setAuthors([authorOne, authorTwo, authorThree]);

    const authorCount = await book.countAuthors();
    expect(authorCount).to.equal(3);
  });

  it('should remove old author association and add a new one but not delete the original author', async function () {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let authorOne = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    let authorTwo = await orm.authors.create({ lastName: 'Sangiacomo', firstName: 'Ken' });

    await book.setAuthors(authorOne);
    let authorCount = await book.countAuthors();
    expect(authorCount).to.equal(1);

    await book.setAuthors(authorTwo);
    authorCount = await book.countAuthors();
    expect(authorCount).to.equal(1);

    let authors = await orm.authors.findAll();
    expect(authors).lengthOf(2);
    expect(authors[0].authorID).to.equal(authorOne.authorID);
    expect(authors[0].lastName).to.equal(authorOne.lastName);
    expect(authors[0].firstName).to.equal(authorOne.firstName);
  });

  it('should remove all author relationships but not delete any authors', async function () {
    await orm.locations.create({ locationName: 'test' });

    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let authorOne = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    let authorTwo = await orm.authors.create({ lastName: 'Sangiacomo', firstName: 'Ken' });

    await book.setAuthors([authorOne, authorTwo]);
    let authorCount = await book.countAuthors();
    expect(authorCount).to.equal(2);

    await book.removeAuthors(await book.getAuthors());
    authorCount = await book.countAuthors();
    expect(authorCount).to.equal(0);

    let authors = await orm.authors.findAll();
    expect(authors).lengthOf(2);
    expect(authors[0].authorID).to.equal(authorOne.authorID);
    expect(authors[0].lastName).to.equal(authorOne.lastName);
    expect(authors[0].firstName).to.equal(authorOne.firstName);
    expect(authors[1].authorID).to.equal(authorTwo.authorID);
    expect(authors[1].lastName).to.equal(authorTwo.lastName);
    expect(authors[1].firstName).to.equal(authorTwo.firstName);
  });

  it('should not remove any authors relationship or change any authors when setting an invalid author', async function () {
    let errorObj = null;

    await orm.locations.create({ locationName: 'test' });
    let book = orm.books.build(paramGoodBookOne);
    await book.save();

    let authorGood = await orm.authors.create({ lastName: 'Cohen', firstName: 'Ronald' });
    await book.setAuthors(authorGood)
      .catch((e) => {
        errorObj = e;
      });

    let authorBad = await orm.authors.build({ authorID: -1, lastName: 'Hombre', firstName: 'Bad' });
    await book.setAuthors(authorBad)
      .catch((e) => {
        errorObj = e;
      });

    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeForeignKeyConstraintError');
    expect(errorObj.index).equals('authorID');

    let authors = await orm.authors.findAll();
    expect(authors).lengthOf(1);
    expect(authors[0].authorID).to.equal(authorGood.authorID);
    expect(authors[0].lastName).to.equal(authorGood.lastName);
    expect(authors[0].firstName).to.equal(authorGood.firstName);
  });
});

describe('model - book - publisher relationship', function () {
  let book = null;
  beforeEach(async function () {
    await bookBefore();
    await orm.locations.create({ locationName: 'test' });
    book = await orm.books.create(paramGoodBookOne);
  });

  it('should add a publisher relationship given a valid publisher', async function () {
    await book.createPublisher({ publisherName: 'MacMillan and Company' });
    let checkPublisher = await orm.publishers.findById(1);
    expect(checkPublisher).is.not.null;
    const publisher = await book.getPublisher();
    expect(publisher.dataValues).deep.equals(checkPublisher.dataValues);
  });

  it('should not add a publisher relationship given an invalid publisher', async function () {
    let errorObj = null;
    book.publisherID = -1;
    await book.save()
      .catch((e) => {
        errorObj = e;
      });
    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeForeignKeyConstraintError');
    expect(errorObj.index).equals('publisherID');
  });

  it('should change the publisher relationship but not delete the publisher', async function () {
    await book.createPublisher({ publisherName: 'MacMillan and Company' });

    await book.createPublisher({ publisherName: 'Bills Books and Liver Emporium' });
    let checkPublisher = await orm.publishers.findById(1);
    expect(checkPublisher).is.not.null;
    checkPublisher = await orm.publishers.findById(2);
    expect(checkPublisher).is.not.null;

    const publisher = await book.getPublisher();
    expect(publisher.dataValues).deep.equals(checkPublisher.dataValues);
  });

  it('should remove the publisher relationship but not delete the publisher', async function () {
    await book.createPublisher({ publisherName: 'MacMillan and Company' });
    let checkPublisher = await orm.publishers.findById(1);
    expect(checkPublisher).is.not.null;

    await book.setPublisher(null);
    checkPublisher = await orm.publishers.findById(1);
    expect(checkPublisher).is.not.null;

    const publisher = await book.getPublisher();
    expect(publisher).is.null;
  });
});

describe('model - book - format relationship', function () {
  let book = null;
  beforeEach(async function () {
    await bookBefore();
    await orm.locations.create({ locationName: 'test' });
    book = await orm.books.create(paramGoodBookOne);
  });

  it('should add a format relationship given a valid format', async function () {
    await book.createFormat({ formatName: 'hardcover' });
    let checkFormat = await orm.formats.findById(1);
    expect(checkFormat).is.not.null;
    const format = await book.getFormat();
    expect(format.dataValues).deep.equals(checkFormat.dataValues);
  });

  it('should not add a format relationship given an invalid format', async function () {
    let errorObj = null;
    book.formatID = -1;
    await book.save()
      .catch((e) => {
        errorObj = e;
      });
    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeForeignKeyConstraintError');
    expect(errorObj.index).equals('formatID');
  });

  it('should change the format relationship but not delete the format', async function () {
    await book.createFormat({ formatName: 'hardcover' });

    await book.createFormat({ formatName: 'kinko\'s copy' });
    let checkFormat = await orm.formats.findById(1);
    expect(checkFormat).is.not.null;
    checkFormat = await orm.formats.findById(2);
    expect(checkFormat).is.not.null;

    const format = await book.getFormat();
    expect(format.dataValues).deep.equals(checkFormat.dataValues);
  });

  it('should remove the format relationship but not delete the format', async function () {
    await book.createFormat({ formatName: 'hardcover' });
    let checkFormat = await orm.formats.findById(1);
    expect(checkFormat).is.not.null;

    await book.setFormat(null);
    checkFormat = await orm.formats.findById(1);
    expect(checkFormat).is.not.null;

    const format = await book.getFormat();
    expect(format).is.null;
  });
});

describe('model - book - location relationship', function () {
  let book = null;
  beforeEach(async function () {
    await bookBefore();
    await orm.locations.create({ locationName: 'test' });
    book = await orm.books.create(paramGoodBookOne);
  });

  it('should not add a location relationship given an invalid location', async function () {
    let errorObj = null;
    book.locationName = 'booger';
    await book.save()
      .catch((e) => {
        errorObj = e;
      });
    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeForeignKeyConstraintError');
    expect(errorObj.index).equals('locationName');
  });

  it('should change the location relationship but not delete the location', async function () {
    await book.createLocation({ locationName: 'Ian\'s Car' });
    let checkLocation = await orm.locations.findById('test');
    expect(checkLocation).is.not.null;
    checkLocation = await orm.locations.findById('Ian\'s Car');
    expect(checkLocation).is.not.null;

    const location = await book.getLocation();
    expect(location.dataValues).deep.equals(checkLocation.dataValues);
  });

  it('should not remove the location relationship', async function () {
    let errorObj = null;
    await book.setLocation(null)
      .catch((e) => {
        errorObj = e;
      });
    expect(errorObj).is.not.null;
    expect(errorObj.name).equals('SequelizeValidationError');
    expect(errorObj.errors).has.lengthOf(1);
    expect(errorObj.errors[0].type).equals('notNull Violation');
    expect(errorObj.errors[0].path).equals('locationName');

    let checkLocation = await orm.locations.findById('test');
    expect(checkLocation).is.not.null;
  });
});

