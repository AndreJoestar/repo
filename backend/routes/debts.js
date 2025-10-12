const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { listDebts, payDebt } = require('../controllers/debtController');

router.use(auth);
router.get('/', listDebts);
router.patch('/:id/pay', payDebt);

module.exports = router;
