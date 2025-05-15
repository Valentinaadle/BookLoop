const User = require('./User');
const Book = require('./Book');
const Loan = require('./Loan');

// Relaciones
User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Loan, { foreignKey: 'bookId' });
Loan.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = {
  User,
  Book,
  Loan
}; 