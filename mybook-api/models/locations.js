module.exports = function(sequelize, DataTypes) {
	const locations = sequelize.define('locations', {
		locationName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true
		}
	}, {
		tableName: 'locations',
		timestamps: false
	});

  locations.associate = function (models) {
    models.locations.hasMany( models.books, {foreignKey: 'locationName', sourceKey: 'locationName'});
  };

  return locations;
};
