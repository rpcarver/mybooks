/**
 * @file books.js
 * Provides sequelize model definition and relationships for the books table
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
  const books = sequelize.define('books', {
    bookID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
        notEmpty: true,
      },
    },
    publisherID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'publishers',
        key: 'publisherID',
      },
    },
    ISBN: {
      type: DataTypes.INTEGER(13),
      allowNull: true,
    },
    printingYear: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    printingNum: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    formatID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'formats',
        key: 'formatID',
      },
    },
    rating: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [1, 500],
        notEmpty: true,
      },
    },
    locationName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'locations',
        key: 'locationName',
      },
    },
  }, {
    tableName: 'books',
    timestamps: false,
  });

  books.associate = function associate(orm) {
    orm.books.belongsTo(orm.publishers, { foreignKey: 'publisherID', targetKey: 'publisherID' });
    orm.books.belongsTo(orm.formats, { foreignKey: 'formatID', targetKey: 'formatID' });
    orm.books.belongsTo(orm.locations, { foreignKey: 'locationName', targetKey: 'locationName' });
    orm.books.belongsToMany(orm.authors, { through: 'books_authors', foreignKey: 'bookID', otherKey: 'authorID' });
  };

  return books;
};
