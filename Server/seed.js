// Run once with:  npm run seed
// Creates an admin account and a few sample rooms.
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');

const photo = (name) => `https://picsum.photos/seed/${name}/600/400`;

(async () => {
  await connectDB();

  const adminEmail = 'admin@hotelpro.com';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: 'Admin', email: adminEmail, password: 'Admin@123', phone: '9999999999', userType: 'admin',
    });
    console.log('Admin created -> admin@hotelpro.com / Admin@123');
  }

  if ((await Room.countDocuments()) === 0) {
    await Room.insertMany([
      { roomNumber: '101', count: 1, rent: 1500, type: 'Non-Delux', photos: [photo('r101a'), photo('r101b')], description: 'Cozy single room with city view' },
      { roomNumber: '102', count: 2, rent: 1800, type: 'Non-Delux', photos: [photo('r102a')], description: 'Quiet room with work desk' },
      { roomNumber: '201', count: 2, rent: 2500, type: 'Delux', photos: [photo('r201a'), photo('r201b')], description: 'Delux double bed room with balcony and free breakfast' },
      { roomNumber: '202', count: 3, rent: 2800, type: 'Delux', photos: [photo('r202a')], description: 'Spacious delux room with sofa' },
      { roomNumber: '301', count: 4, rent: 5000, type: 'Delux', photos: [photo('r301a'), photo('r301b')], description: 'Luxury family suite with living area' },
    ]);
    console.log('Sample rooms created');
  }

  process.exit(0);
})();
