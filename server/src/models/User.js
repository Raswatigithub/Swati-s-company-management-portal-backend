const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'client'], required: true },
  company: { type: String }, // For clients
  profile: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
