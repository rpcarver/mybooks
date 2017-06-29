module.exports = function(sequelize, DataTypes) {
	const publishers = sequelize.define('publishers', {
		publisherID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		publisherName: {
			type: DataTypes.STRING(150),
			allowNull: false
		}
	}, {
		tableName: 'publishers',
		timestamps: false
	});

  publishers.associate = function (models) {
    models.publishers.hasMany( models.books, {foreignKey: 'publisherID', sourceKey: 'publisherID'});
  };

  return publishers;
};
