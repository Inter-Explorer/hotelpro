const mongoose = require('mongoose');

// Room model: roomNumber, count (max people), rent (per day), type, photos, description.
// "currentbookings" of a room are the active bookings of that room in the Booking collection.
const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, required: true, min: 1 },
    rent: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['Delux', 'Non-Delux'], required: true },
    photos: { type: [String], default: [] },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
