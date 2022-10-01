const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please enter a user name'] },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password with at least 8 characters'],
    },
    isAdmin: {
      type: String,
      required: [true, 'Are you an admin?'],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
