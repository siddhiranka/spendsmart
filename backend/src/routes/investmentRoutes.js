const express = require('express');
const router = express.Router();
const { addInvestment, getInvestments, deleteInvestment } = require('../controllers/investmentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .post(addInvestment)
    .get(getInvestments);

router.route('/:id')
    .delete(deleteInvestment);

module.exports = router;
