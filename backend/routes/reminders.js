const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createReminder } = require('../controllers/reminderController');

router.use(auth);
router.post('/', createReminder);

module.exports = router;
