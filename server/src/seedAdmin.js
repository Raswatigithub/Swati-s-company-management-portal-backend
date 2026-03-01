const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const adminEmail = 'admin@swatisoft.com';
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Swati Admin',
        email: adminEmail,
        password: hashed,
        role: 'admin',
      });
      console.log('Seeded initial admin user: admin@swatisoft.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    mongoose.disconnect();
  });
