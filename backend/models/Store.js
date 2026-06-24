const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: [0, 400]
    }
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Store;
