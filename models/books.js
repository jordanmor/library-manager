'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  Books.associate = function(models) {
    Books.hasMany(models.Loans, {foreignKey: 'book_id'});
  };
  return Books;
};