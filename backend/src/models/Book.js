const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleBooksId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authors: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishedDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 99.99
  }
}, {
  timestamps: true
});

module.exports = Book; 