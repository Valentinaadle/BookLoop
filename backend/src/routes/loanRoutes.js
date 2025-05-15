const express = require('express');
const router = express.Router();
const {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} = require('../controllers/loanController');

router.get('/', getLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);

module.exports = router; 