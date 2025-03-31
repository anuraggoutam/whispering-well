
/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

// Register a new user
router.post('/register', authLimiter, register);

// Login user
router.post('/login', authLimiter, login);

// Get user profile (protected route)
router.get('/profile', authenticateToken, getProfile);

// Logout user (protected route)
router.post('/logout', authenticateToken, logout);

module.exports = router;
