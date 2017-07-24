/**
 * @file publishers.js
 * Provides sequelize model definition and relationships for the publishers table
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
  const publishers = sequelize.define('publishers', {
    publisherID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    publisherName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 150],
      },
    },
  }, {
    tableName: 'publishers',
    timestamps: false,
  });

  publishers.associate = function associate(orm) {
    orm.publishers.hasMany(orm.books, { foreignKey: 'publisherID', sourceKey: 'publisherID' });
  };

  return publishers;
};
