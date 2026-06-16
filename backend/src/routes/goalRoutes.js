const express = require('express');
const router = express.Router();
const { addGoal, getGoals, updateGoalProgress, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .post(addGoal)
    .get(getGoals);

router.route('/:id')
    .put(updateGoalProgress)
    .delete(deleteGoal);

module.exports = router;
