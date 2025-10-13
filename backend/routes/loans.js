const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { listLoans, createLoan } = require('../controllers/loanController');

router.use(auth);
router.get('/', listLoans);
router.post('/', createLoan);

module.exports = router;
