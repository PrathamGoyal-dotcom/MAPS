const express = require('express');
const path = require('path');
const cors = require('cors');

const memberRoutes = require('./routes/member.routes');
const registrationRoutes = require('./routes/registration.routes');
const bookingRoutes = require('./routes/booking.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../')));

// Root Route for Health Check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// API Routes
// Note: original routes in server.js were top-level /api/register etc., 
// so we mount them at /api
app.use('/api', memberRoutes);
app.use('/api', registrationRoutes);
app.use('/api', bookingRoutes);
app.use('/api/chat', chatRoutes); // Because routes inside are /, /react

module.exports = app;
