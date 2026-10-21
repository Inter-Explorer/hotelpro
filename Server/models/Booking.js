const mongoose = require('mongoose');

// Booking model as in the institute's notes.
// SECURITY: the CVV is checked at payment time but never saved, and only the last
// four digits of the card number are kept (see bookingController.js).
const bookingSchema = new mongoose.Schema(
  {
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    type: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    fromdate: { type: Date, required: true },
    todate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    totaldays: { type: Number, required: true },
    phone: { type: String, required: true },
    cardDetails: {
      cardholdername: { type: String, required: true },
      cardnumber: { type: String, required: true }, // masked: **** **** **** 1234
      expmonthyear: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['booked', 'checked-in', 'checked-out', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
