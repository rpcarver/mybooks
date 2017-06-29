module.exports = function(sequelize, DataTypes) {
	const formats = sequelize.define('formats', {
		formatID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		formatName: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true
		}
	}, {
		tableName: 'formats',
		timestamps: false
	});

  formats.associate = function (models) {
    models.formats.hasMany( models.books, {foreignKey: 'formatID', sourceKey: 'formatID'});
  };

  return formats;
};
