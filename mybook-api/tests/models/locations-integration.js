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

const expect = chai.expect;

const orm = require('../../models/orm');

describe('model - author - create and select one', () => {
  let author = null;
  before(async () => {
    expect(orm).to.have.property('authors');

    // drops the tables imported into the db and recreates them
    try {
      await orm.sequelize.sync({ force: true });
      author = await orm.authors.create({ lastName: 'Fred', firstName: 'Flintstone' });
    } catch (e) {
      e.stack = null;
      throw e;
    }
  });

  it('should have created an author and selected it', async () => {
    expect(author.authorID).to.equal(1);
    const checkAuthor = await orm.authors.findById(author.authorID);
    expect(checkAuthor.firstName).to.equal(author.firstName);
    expect(checkAuthor.lastName).to.equal(author.lastName);
  });
});

