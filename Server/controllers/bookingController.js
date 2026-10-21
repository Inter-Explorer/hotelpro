const Room = require('../models/Room');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const { parseDates, isRoomAvailable } = require('../utils/availability');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Allowed admin moves: booked -> checked-in -> checked-out
const NEXT = { booked: 'checked-in', 'checked-in': 'checked-out' };

// Validates the (simulated) payment card.
// SECURITY: the CVV is only checked here and then thrown away. Only the last four
// digits of the card number are returned for saving. No real payment is made.
function checkCard(card = {}) {
  const { cardholdername, cardnumber, expmonthyear, cvvcode } = card;
  const digits = String(cardnumber || '').replace(/\s+/g, '');

  if (!cardholdername || !String(cardholdername).trim()) throw httpError(400, 'Enter the cardholder name');
  if (!/^\d{16}$/.test(digits)) throw httpError(400, 'Card number must be 16 digits');
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expmonthyear || '')) throw httpError(400, 'Expiry must be in MM/YY format');
  if (!/^\d{3,4}$/.test(String(cvvcode || ''))) throw httpError(400, 'Enter a valid CVV');

  const [mm, yy] = expmonthyear.split('/').map(Number);
  const now = new Date();
  const expired = 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
  if (expired) throw httpError(400, 'This card has expired');

  return {
    cardholdername: String(cardholdername).trim(),
    cardnumber: `**** **** **** ${digits.slice(-4)}`,
    expmonthyear,
  };
}

// POST /api/bookings   (logged-in user): book and pay for a room
exports.createBooking = asyncHandler(async (req, res) => {
  const { roomId, fromdate, todate, guests, cardDetails } = req.body;
  if (!roomId || !fromdate || !todate) throw httpError(400, 'Room and dates are required');

  const dates = parseDates(fromdate, todate);

  const room = await Room.findById(roomId);
  if (!room) throw httpError(404, 'Room not found');
  if (guests && Number(guests) > room.count) {
    throw httpError(400, `This room holds at most ${room.count} people`);
  }

  const card = checkCard(cardDetails);

  // Double-booking protection: check the overlap rule.
  const free = await isRoomAvailable(room._id, dates.fromdate, dates.todate);
  if (!free) throw httpError(409, 'Sorry, this room is already booked for those dates');

  const totaldays = Math.ceil((dates.todate - dates.fromdate) / MS_PER_DAY);

  const booking = await Booking.create({
    roomid: room._id,
    type: room.type,
    userid: req.user._id,
    username: req.user.name,
    fromdate: dates.fromdate,
    todate: dates.todate,
    totaldays,
    totalAmount: totaldays * room.rent,
    phone: req.user.phone,
    cardDetails: card,
  });
  res.status(201).json(booking);
});

// GET /api/bookings/my   (my own bookings)
exports.myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userid: req.user._id }).populate('roomid').sort('-createdAt');
  res.json(bookings);
});

// GET /api/bookings   (admin: every booking)
exports.allBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate('roomid').populate('userid', 'name email phone').sort('-createdAt');
  res.json(bookings);
});

// PUT /api/bookings/:id/cancel   (owner or admin)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw httpError(404, 'Booking not found');

  const isOwner = booking.userid.equals(req.user._id);
  if (!isOwner && req.user.userType !== 'admin') throw httpError(403, 'Not your booking');
  if (booking.status !== 'booked') throw httpError(400, 'Only upcoming bookings can be cancelled');

  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});

// PUT /api/bookings/:id/status   (admin) check-in / check-out
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw httpError(404, 'Booking not found');

  const { status } = req.body;
  if (NEXT[booking.status] !== status) {
    throw httpError(400, `Cannot move from "${booking.status}" to "${status}"`);
  }
  booking.status = status;
  await booking.save();
  res.json(booking);
});
