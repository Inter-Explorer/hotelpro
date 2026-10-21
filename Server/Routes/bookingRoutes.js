const express = require('express');
const {
  createBooking, myBookings, allBookings, cancelBooking, updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, myBookings);                  // must stay above '/:id' routes
router.get('/', protect, adminOnly, allBookings);        // admin
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus); // admin

module.exports = router;
