const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

// protect: only allows requests that carry a valid token ("wristband").
// The frontend sends:  Authorization: Bearer <token>
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw httpError(401, 'Please log in first');

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw httpError(401, 'Invalid or expired token, please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw httpError(401, 'This user no longer exists');

  req.user = user; // later code can now use req.user
  next();
});

// adminOnly: used AFTER protect. Blocks normal guests.
exports.adminOnly = (req, res, next) => {
  if (req.user.userType !== 'admin') return next(httpError(403, 'Admins only'));
  next();
};
