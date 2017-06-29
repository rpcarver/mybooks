/**
 * Created by rcarver on 6/27/17.
 */
require('../../config/env');

const expect = require('chai').expect;
const orm = require('../../models/orm');

describe('author model - insert', () => {
  let author = null;
  before(async() => {
    expect(orm).to.have.own.property('authors');

    // drops the tables imported into the db and recreates them
    await orm.sequelize.sync({ force: true });
    author = await orm.authors.create({ lastName: 'Fred', firstName: 'Flintstone' });
  });

  it('should have created an author', async () => {
    expect(author.authorID).to.equal(1);
    const checkAuthor = await orm.authors.findById(author.authorID);
    expect(checkAuthor.firstName).to.equal(author.firstName);
    expect(checkAuthor.lastName).to.equal(author.lastName);
  });
});
