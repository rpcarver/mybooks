module.exports = function(sequelize, DataTypes) {
	const books = sequelize.define('books', {
		bookID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		publisherID: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'publishers',
				key: 'publisherID'
			}
		},
		ISBN: {
			type: DataTypes.INTEGER(13),
			allowNull: true
		},
		printingYear: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		printingNum: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		formatID: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'formats',
				key: 'formatID'
			}
		},
		rating: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		locationName: {
			type: DataTypes.STRING(45),
			allowNull: false,
			references: {
				model: 'locations',
				key: 'locationName'
			}
		}
	}, {
		tableName: 'books',
		timestamps: false
	});

  books.associate = function (models) {
    models.books.belongsTo(models.publishers, { foreignKey: 'publisherID', targetKey: 'publisherID' });
    models.books.belongsTo(models.formats, { foreignKey: 'formatID', targetKey: 'formatID' });
    models.books.belongsTo(models.locations, { foreignKey: 'locationName', targetKey: 'locationName' });
    models.books.belongsToMany(models.authors, { through: 'books_authors', foreignKey: 'bookID', otherKey: 'authorID' });
  };

  return books;
};
