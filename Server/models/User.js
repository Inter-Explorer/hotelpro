const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model: name, email, password, phone, userType (as in the institute's notes).
// "confirm password" is only a form field. It is checked in the controller and never saved.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false means the password is NOT returned in queries unless we ask for it
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true, match: [/^[0-9]{10}$/, 'Phone must be 10 digits'] },
    userType: { type: String, enum: ['ordinary', 'admin'], default: 'ordinary' },
  },
  { timestamps: true }
);

// Runs automatically before every save: scramble (hash) the password.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compares a typed password with the stored hash.
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
