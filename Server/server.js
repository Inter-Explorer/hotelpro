require('dotenv').config(); // loads values from the .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());          // allows the React app to call this server
app.use(express.json());  // lets us read JSON sent in request bodies

app.get('/', (req, res) => res.json({ message: 'HotelPro API is running' }));

app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/rooms', require('./Routes/roomRoutes'));
app.use('/api/bookings', require('./Routes/bookingRoutes'));

// Unknown URL
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Central error handler: every error ends up here.
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError') { status = 400; message = 'Invalid ID'; }
  if (err.name === 'ValidationError') { status = 400; }
  if (status === 500) console.error(err);

  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
