/**
 * @file formats.js
 * Provides sequelize model definition and relationships for the formats tables
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
  const formats = sequelize.define('formats', {
    formatID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    formatName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      notEmpty: true,
      validate: {
        len: [3, 45],
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      notEmpty: true,
      validate: {
        len: [1, 500],
      },
    },
  }, {
    tableName: 'formats',
    timestamps: false,
  });

  formats.associate = function associate(orm) {
    orm.formats.hasMany(orm.books, { foreignKey: 'formatID', sourceKey: 'formatID' });
  };

  return formats;
};
