const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

// Obtener todos los préstamos
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: Book },
        { model: User }
      ]
    });
    res.json(loans);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ message: 'Error al obtener préstamos' });
  }
};

// Obtener un préstamo por ID
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: Book },
        { model: User }
      ]
    });
    if (loan) {
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener préstamo:', error);
    res.status(500).json({ message: 'Error al obtener préstamo' });
  }
};

// Crear un nuevo préstamo
const createLoan = async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json(loan);
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ message: 'Error al crear préstamo' });
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

const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (loan) {
      await loan.update(req.body);
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar préstamo:', error);
    res.status(500).json({ message: 'Error al actualizar préstamo' });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (loan) {
      await loan.destroy();
      res.json({ message: 'Préstamo eliminado' });
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    res.status(500).json({ message: 'Error al eliminar préstamo' });
  }
};

module.exports = {
  getLoans,
  getLoanById,
  createLoan,
  returnBook,
  getLoansByUser,
  updateLoan,
  deleteLoan
}; 