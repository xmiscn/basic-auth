const express = require('express');

// Get the environment variables from .env
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

const { errorHandler } = require('./middleware/error');
const colors = require('colors');
const connectDB = require('./config/db');

// Initialization
connectDB();
const app = express();

// Install middleware for parsing the body of the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define the routes for the user and ticket API
// Use the routes defined in userRoutes.js and ticketRoutes.js
app.use('/api/users', require('./routes/userRoutes'));

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // FIX: below code fixes app crashing on refresh in deployment
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (_, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' });
  });
}
// Needs to be the very last middleware
app.use(errorHandler);
// ... and go ...
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
