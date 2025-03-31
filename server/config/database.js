
/**
 * Database configuration using MySQL with Drizzle ORM
 */
const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const { migrate } = require('drizzle-orm/mysql2/migrator');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'whisperchat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;
let pool;

/**
 * Initialize database connection
 */
const initializeDatabase = async () => {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Initialize Drizzle with the MySQL connection
    db = drizzle(pool);
    
    console.log('Database connection established successfully');
    
    // Run migrations
    // Uncomment this in production after setting up migration files
    // await migrate(db, { migrationsFolder: './migrations' });
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Get database instance
 */
const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

/**
 * Close database connection
 */
const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
};

module.exports = {
  initializeDatabase,
  getDb,
  closeDatabase
};
