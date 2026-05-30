const express = require('express');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

// Chat routes
router.get('/', chatController.getChats);
router.post('/', chatController.postChat);
router.post('/react', chatController.reactChat);

module.exports = router;
