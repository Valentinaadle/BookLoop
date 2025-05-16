const { DataTypes } = require('sequelize');
const { bookDB } = require('../config/db');

const Loan = bookDB.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  },
  loanDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'overdue'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (loan) => {
      // Actualizar el estado del libro a no disponible
      const Book = require('./Book');
      await Book.update(
        { available: false },
        { where: { id: loan.bookId } }
      );
    },
    afterUpdate: async (loan) => {
      // Si el préstamo se marca como devuelto, actualizar el libro a disponible
      if (loan.status === 'returned') {
        const Book = require('./Book');
        await Book.update(
          { available: true },
          { where: { id: loan.bookId } }
        );
      }
    }
  }
});

module.exports = Loan; 