
/**
 * Main server file
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { initializeDatabase, closeDatabase } = require('./config/database');
const setupWebSocket = require('./websocket');
const { generalLimiter } = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const io = setupWebSocket(server);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await closeDatabase();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
