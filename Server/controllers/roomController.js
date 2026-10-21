const Room = require('../models/Room');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');
const { parseDates, getBookedRoomIds } = require('../utils/availability');

// Keeps only the fields a room is allowed to have, and removes empty photo links.
const pickRoomFields = (body) => ({
  roomNumber: body.roomNumber,
  count: body.count,
  rent: body.rent,
  type: body.type,
  photos: (body.photos || []).filter(Boolean),
  description: body.description,
});

// GET /api/rooms?fromdate=2026-10-20&todate=2026-10-23&guests=2&type=Delux
// Public. If both dates are given, only FREE rooms are returned.
exports.listRooms = asyncHandler(async (req, res) => {
  const { fromdate, todate, guests, type } = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (guests) filter.count = { $gte: Number(guests) };

  if (fromdate && todate) {
    const dates = parseDates(fromdate, todate);
    const bookedIds = await getBookedRoomIds(dates.fromdate, dates.todate);
    filter._id = { $nin: bookedIds };
  }

  const rooms = await Room.find(filter).sort('rent');
  res.json(rooms);
});

// POST /api/rooms  (admin)
exports.createRoom = asyncHandler(async (req, res) => {
  const data = pickRoomFields(req.body);
  const exists = await Room.findOne({ roomNumber: data.roomNumber });
  if (exists) throw httpError(400, 'A room with this number already exists');
  const room = await Room.create(data);
  res.status(201).json(room);
});

// PUT /api/rooms/:id  (admin)
exports.updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, pickRoomFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!room) throw httpError(404, 'Room not found');
  res.json(room);
});

// DELETE /api/rooms/:id  (admin)
exports.deleteRoom = asyncHandler(async (req, res) => {
  const active = await Booking.countDocuments({
    roomid: req.params.id,
    status: { $in: ['booked', 'checked-in'] },
  });
  if (active > 0) throw httpError(400, 'Cannot delete a room that has active bookings');

  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) throw httpError(404, 'Room not found');
  res.json({ message: 'Room deleted' });
});
