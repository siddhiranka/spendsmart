const express = require('express');
const router = express.Router();
const { setBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', setBudget);
router.get('/', getBudget);

module.exports = router;
