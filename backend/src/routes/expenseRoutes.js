const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All expense routes are protected

router.route('/')
    .post(addExpense)
    .get(getExpenses);

router.route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;
