
/**
 * Authentication controller
 */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { eq } = require('drizzle-orm');
const { getDb } = require('../config/database');
const { users } = require('../models/schema');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const db = getDb();

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    const newUser = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      status: 'online'
    };

    await db.insert(users).values(newUser);

    // Get user without password
    const createdUser = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      avatar: users.avatar,
      status: users.status,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId)).limit(1);

    // Generate JWT token
    const token = generateToken(createdUser[0]);

    return res.status(201).json({
      message: 'User registered successfully',
      user: createdUser[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
};

/**
 * Login a user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update user status to online
    await db.update(users)
      .set({ status: 'online', lastSeen: new Date() })
      .where(eq(users.id, user.id));

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const db = getDb();
    
    // Find user by id
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      avatar: users.avatar,
      status: users.status,
      lastSeen: users.lastSeen,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

/**
 * Logout a user
 */
const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const db = getDb();
    
    // Update user status to offline
    await db.update(users)
      .set({ status: 'offline', lastSeen: new Date() })
      .where(eq(users.id, userId));
    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Server error during logout' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
