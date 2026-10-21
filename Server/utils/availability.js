const Booking = require('../models/Booking');
const httpError = require('./httpError');

// Only these bookings occupy a room. Cancelled / checked-out ones do not.
const ACTIVE = ['booked', 'checked-in'];

// Turns two date strings into Date objects and validates them.
function parseDates(fromStr, toStr) {
  const fromdate = new Date(fromStr);
  const todate = new Date(toStr);

  if (isNaN(fromdate) || isNaN(todate)) throw httpError(400, 'Invalid dates');
  if (todate <= fromdate) throw httpError(400, 'Departure date must be after arrival date');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (fromdate < today) throw httpError(400, 'Arrival date cannot be in the past');

  return { fromdate, todate };
}

// THE HEART OF THE PROJECT: the overlap rule.
// An existing booking blocks us if:
//   existing.fromdate < requested.todate  AND  existing.todate > requested.fromdate
function overlapQuery(fromdate, todate) {
  return {
    status: { $in: ACTIVE },
    fromdate: { $lt: todate },
    todate: { $gt: fromdate },
  };
}

// IDs of all rooms that are taken during these dates.
async function getBookedRoomIds(fromdate, todate) {
  const bookings = await Booking.find(overlapQuery(fromdate, todate)).select('roomid');
  return bookings.map((b) => b.roomid);
}

// true if this one room is free during these dates.
async function isRoomAvailable(roomId, fromdate, todate) {
  const count = await Booking.countDocuments({
    roomid: roomId,
    ...overlapQuery(fromdate, todate),
  });
  return count === 0;
}

module.exports = { parseDates, getBookedRoomIds, isRoomAvailable };
