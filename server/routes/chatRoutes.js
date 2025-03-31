
/**
 * Chat routes
 */
const express = require('express');
const router = express.Router();
const { getUserChats, createChat, getChatById } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/rateLimit');

// Get all chats for the current user
router.get('/', authenticateToken, generalLimiter, getUserChats);

// Create a new chat
router.post('/', authenticateToken, generalLimiter, createChat);

// Get a specific chat by ID
router.get('/:chatId', authenticateToken, generalLimiter, getChatById);

module.exports = router;
