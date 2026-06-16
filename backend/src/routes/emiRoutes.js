const express = require('express');
const router = express.Router();
const { addEMI, getEMIs, deleteEMI } = require('../controllers/emiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .post(addEMI)
    .get(getEMIs);

router.route('/:id')
    .delete(deleteEMI);

module.exports = router;
