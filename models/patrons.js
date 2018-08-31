'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library ID is required'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: ["^[0-9]{5}$"],
          msg: 'Please enter a valid 5 digit zip code'
        }
      }
    }
  }, {
    timestamps: false
  });
  Patrons.associate = function(models) {
    Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'});
  };
  return Patrons;
};