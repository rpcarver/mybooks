/**
 * @file locations.js
 * Provides sequelize model definition and relationships for the locations tables
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
  const locations = sequelize.define('locations', {
    locationName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [3, 500],
      },
    },
  }, {
    tableName: 'locations',
    timestamps: false,
  });

  locations.associate = function associate(orm) {
    orm.locations.hasMany(orm.books, { foreignKey: 'locationName', sourceKey: 'locationName' });
  };

  return locations;
};
