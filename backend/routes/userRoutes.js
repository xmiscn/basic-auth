const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Define the routes
// Use the functions defined in controllers: userController.js

router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getProfile);

module.exports = router;
