
/**
 * Message routes
 */
const express = require('express');
const router = express.Router();
const { getChatMessages, sendMessage } = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');
const { generalLimiter, messageLimiter } = require('../middleware/rateLimit');

// Get messages for a specific chat
router.get('/:chatId', authenticateToken, generalLimiter, getChatMessages);

// Send a new message to a chat
router.post('/:chatId', authenticateToken, messageLimiter, sendMessage);

module.exports = router;
