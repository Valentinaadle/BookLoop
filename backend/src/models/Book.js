const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  description: {
    type: DataTypes.TEXT
  },
  publishedDate: {
    type: DataTypes.DATE
  },
  pageCount: {
    type: DataTypes.INTEGER
  },
  imageUrl: {
    type: DataTypes.STRING(1000)
  }
}, {
  timestamps: true
});

module.exports = Book; 