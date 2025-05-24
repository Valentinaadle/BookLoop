const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

Category.seedCategories = async () => {
  const categories = [
    'Novela',
    'Cuento',
    'Poesía',
    'Drama',
    'Ciencia ficción',
    'Fantasía',
    'Misterio',
    'Terror',
    'Romance',
    'Deportes',
    'Realistas',
    'Salud',
    'Tecnología',
    'Ciencias',
    'Escolar',
    'Filosofía'
  ];
  for (const name of categories) {
    await Category.findOrCreate({ where: { category_name: name } });
  }
};

module.exports = Category; 