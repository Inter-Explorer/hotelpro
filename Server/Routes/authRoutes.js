const express = require('express');
const { register, login, getMe, listUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, listUsers); // admin: all users

module.exports = router;
