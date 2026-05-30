const express = require('express');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

// Payment/Booking routes
router.post('/payment', bookingController.payment);

module.exports = router;
