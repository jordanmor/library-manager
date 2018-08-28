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
    first_published: DataTypes.INTEGER
  }, {});
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};