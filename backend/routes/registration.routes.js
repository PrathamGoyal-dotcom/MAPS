const express = require('express');
const registrationController = require('../controllers/registration.controller');

const router = express.Router();

// Registration/Join routes
router.post('/join', registrationController.join);

module.exports = router;
