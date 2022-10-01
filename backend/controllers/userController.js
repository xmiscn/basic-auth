// @desc - Register a new user
// @route - POST /api/users
// @access - Public
// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/userModel');

// @desc - Get current users profile
// @route - GET /api/users/profile
// @access - Private
const getProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Registration Error: Please enter all fields');
  }

  // Email validation
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Registration Error: Please enter a valid email');
  }

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Registration Error: User already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Registration Error: Invalid user data');
  }
});

// @desc - Login a user
// @route - POST /api/users/login
// @access - Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Login Error: Please enter all fields');
  }

  // Check for existing user and validate hashed password
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Login Error: Invalid email or password');
  }
});

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30min',
  });
};

module.exports = { registerUser, loginUser, getProfile };
