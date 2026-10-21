const express = require('express');
const { listRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', listRooms);                              // public
router.post('/', protect, adminOnly, createRoom);        // admin
router.put('/:id', protect, adminOnly, updateRoom);      // admin
router.delete('/:id', protect, adminOnly, deleteRoom);   // admin

module.exports = router;
