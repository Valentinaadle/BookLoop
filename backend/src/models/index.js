const User = require('./User');
const Book = require('./Book');
const Profile = require('./Profile');
const Category = require('./Category');
const Role = require('./Role');
const Transaction = require('./Transaction');
const Review = require('./Review');
const Image = require('./Image');
const Wishlist = require('./Wishlist');

// Exportar modelos solo como objetos de funciones CRUD
module.exports = {
  User,
  Book,
  Profile,
  Category,
  Role,
  Transaction,
  Review,
  Image,
  Wishlist
};