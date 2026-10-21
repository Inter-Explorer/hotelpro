const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userData = (u) => ({
  id: u._id, name: u.name, email: u.email, phone: u.phone, userType: u.userType,
});

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, phone, userType = 'ordinary', adminCode } = req.body;

  if (!name || !email || !password || !confirmPassword || !phone) {
    throw httpError(400, 'All fields are required');
  }
  if (password !== confirmPassword) throw httpError(400, 'Password and confirm password do not match');
  if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters');
  if (!['ordinary', 'admin'].includes(userType)) throw httpError(400, 'Invalid user type');

  // SECURITY: anyone can type "admin" in a form, so admin signup needs a secret code
  // that only the hotel owner knows (ADMIN_CODE in the .env file).
  if (userType === 'admin') {
    if (!process.env.ADMIN_CODE || adminCode !== process.env.ADMIN_CODE) {
      throw httpError(403, 'Invalid admin code');
    }
  }

  const exists = await User.findOne({ email });
  if (exists) throw httpError(400, 'This email is already registered');

  const user = await User.create({ name, email, password, phone, userType });
  res.status(201).json({ message: 'Account created successfully', user: userData(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw httpError(401, 'Invalid email or password'); // same message for both: do not reveal which was wrong
  }
  res.json({ token: makeToken(user._id), user: userData(user) });
});

// GET /api/auth/me  (who am I?)
exports.getMe = (req, res) => {
  res.json({ user: userData(req.user) });
};

// GET /api/auth/users  (admin: all registered users)
exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json(users);
});
