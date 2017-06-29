module.exports = function(sequelize, DataTypes) {
	return sequelize.define('books_authors', {
		bookID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'books',
				key: 'bookID'
			}
		},
		authorID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'authors',
				key: 'authorID'
			}
		}
	}, {
		tableName: 'books_authors',
		timestamps: false
	});

	/*
	 * books_authors represents the junction table for the many to many relationship between books
	 * and authors. The relationships are defined in the respective models instead of in books_authors.
	 */

};
