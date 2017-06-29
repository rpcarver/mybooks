module.exports = function(sequelize, DataTypes) {
	const authors = sequelize.define('authors', {
		authorID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		lastName: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		firstName: {
			type: DataTypes.STRING(45),
			allowNull: true
		}
	}, {
		tableName: 'authors',
		timestamps: false
	});

  authors.associate = function (models) {
    models.authors.belongsToMany(models.books, { through: 'books_authors', foreignKey: 'authorID', otherKey: 'bookID' });
  };

  return authors;
};
