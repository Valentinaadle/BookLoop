const User = require('./User');
const Book = require('./Book');
const Loan = require('./Loan');

// Relaciones
User.hasMany(Loan);
Loan.belongsTo(User);

Book.hasMany(Loan);
Loan.belongsTo(Book);

module.exports = {
  User,
  Book,
  Loan
}; 