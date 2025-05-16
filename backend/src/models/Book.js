const { DataTypes } = require('sequelize');
const { bookDB } = require('../config/db');

const Book = bookDB.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleBooksId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
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
  },
  categories: {
    type: DataTypes.STRING
  },
  language: {
    type: DataTypes.STRING(10)
  },
  averageRating: {
    type: DataTypes.FLOAT
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Book; 