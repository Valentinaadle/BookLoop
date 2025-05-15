const express = require('express');
const router = express.Router();
const {
  getLoans,
  getLoanById,
  createLoan,
  returnBook,
  getLoansByUser
} = require('../controllers/loanController');

router.get('/', getLoans);
router.get('/:id', getLoanById);
router.get('/user/:userId', getLoansByUser);
router.post('/', createLoan);
router.put('/:id/return', returnBook);

module.exports = router; 