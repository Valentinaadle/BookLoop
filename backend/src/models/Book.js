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
  authors: {
    type: DataTypes.JSON,  // Almacenará el array de autores
    allowNull: false,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageLinks: {
    type: DataTypes.JSON,  // Almacenará el objeto con las URLs de las imágenes
    allowNull: true,
    defaultValue: { thumbnail: '' }
  }
}, {
  timestamps: true
});

module.exports = Book; 