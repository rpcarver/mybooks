/**
 * @file authors.js
 * Provides sequelize model definition and relationships for the authors table
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
  const authors = sequelize.define('authors', {
    authorID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        notEmpty: true,
        len: {
          args: [0, 45],
          msg: 'bogus',
        },
      },
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [3, 45],
      },
    },
  }, {
    tableName: 'authors',
    timestamps: false,
  });

  authors.associate = function associate(orm) {
    orm.authors.belongsToMany(orm.books, { through: 'books_authors', foreignKey: 'authorID', otherKey: 'bookID' });
  };

  return authors;
};
