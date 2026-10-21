const mongoose = require('mongoose');

// Connects to MongoDB using the address stored in the .env file.
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // stop the program, nothing works without a database
  }
}

module.exports = connectDB;
