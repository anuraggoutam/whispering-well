
/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  // Remove sensitive information
  const userInfo = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  
  // Generate token with 24h expiration
  return jwt.sign(userInfo, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  generateToken
};
