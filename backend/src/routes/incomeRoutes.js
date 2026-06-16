const express = require('express');
const router = express.Router();
const { addIncome, getIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All income routes are protected

router.route('/')
    .post(addIncome)
    .get(getIncome);

router.route('/:id')
    .put(updateIncome)
    .delete(deleteIncome);

module.exports = router;
