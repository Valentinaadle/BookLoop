const { Loan, Book, User } = require('../models');

// Obtener todos los préstamos
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un préstamo por ID
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ]
    });
    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo préstamo
const createLoan = async (req, res) => {
  try {
    const book = await Book.findByPk(req.body.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    if (!book.available || book.stock <= 0) {
      return res.status(400).json({ message: 'Libro no disponible para préstamo' });
    }

    const loan = await Loan.create(req.body);
    await book.update({
      stock: book.stock - 1,
      available: book.stock - 1 > 0
    });

    const loanWithDetails = await Loan.findByPk(loan.id, {
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ]
    });

    res.status(201).json(loanWithDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Devolver un libro (actualizar préstamo)
const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }
    if (loan.status === 'returned') {
      return res.status(400).json({ message: 'Este libro ya fue devuelto' });
    }

    const book = await Book.findByPk(loan.bookId);
    await loan.update({
      returnDate: new Date(),
      status: 'returned'
    });

    await book.update({
      stock: book.stock + 1,
      available: true
    });

    res.json({ message: 'Libro devuelto correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener préstamos por usuario
const getLoansByUser = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Book, attributes: ['id', 'title', 'author'] }
      ]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLoans,
  getLoanById,
  createLoan,
  returnBook,
  getLoansByUser
}; 