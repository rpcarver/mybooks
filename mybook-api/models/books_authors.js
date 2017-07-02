/**
 * @file books_authors.js
 * Provides sequelize model definition for the books_authors table. books_authors represents the
 * junction table for the many to many relationship between books and authors. The relationships
 * are defined in the respective models instead of in books_authors
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
module.exports = function construct(sequelize, DataTypes) {
  return sequelize.define('books_authors', {
    bookID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'books',
        key: 'bookID',
      },
    },
    authorID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'authors',
        key: 'authorID',
      },
    },
  }, {
    tableName: 'books_authors',
    timestamps: false,
  });

  /**
   * books_authors represents the junction table for the many to many relationship between books
   * and authors. The relationships are defined in the respective models instead of in books_authors
  **/
};
