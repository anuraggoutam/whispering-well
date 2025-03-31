
/**
 * Rate limiting middleware to prevent abuse of the API
 */
const rateLimit = require('express-rate-limit');

/**
 * Create a general rate limiter for all routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests, please try again later.'
  }
});

/**
 * Create a stricter rate limiter for authentication routes
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts, please try again later.'
  }
});

/**
 * Create a rate limiter for message sending
 */
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 messages per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Sending too many messages too quickly, please slow down.'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  messageLimiter
};
