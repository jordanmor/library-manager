'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book ID is required'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron ID is required'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Return by date is required'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Return by date is required'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Returned on date is required'
        }
      }
    }
  }, {
    timestamps: false
  });
  Loans.associate = function(models) {
    Loans.belongsTo(models.Books, {foreignKey: 'book_id'});
    Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'});
  };
  return Loans;
};