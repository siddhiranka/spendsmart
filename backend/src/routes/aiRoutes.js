const express = require('express');
const router = express.Router();
const { getFinancialInsights } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/insights', getFinancialInsights);

module.exports = router;
