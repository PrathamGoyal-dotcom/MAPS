const express = require('express');
const memberController = require('../controllers/member.controller');

const router = express.Router();

// Register and Login routes for members
router.post('/register', memberController.register);
router.post('/login', memberController.login);

module.exports = router;
