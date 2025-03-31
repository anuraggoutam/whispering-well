
/**
 * WebSocket server setup and event handlers
 */
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getDb } = require('./config/database');
const { eq, and } = require('drizzle-orm');
const { users, chatParticipants } = require('./models/schema');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Map of online users (userId -> socketId)
const onlineUsers = new Map();

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token is required'));
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    
    try {
      console.log(`User connected: ${userId}`);
      
      // Add user to online users map
      onlineUsers.set(userId, socket.id);
      
      // Update user status to online
      const db = getDb();
      await db.update(users)
        .set({ status: 'online' })
        .where(eq(users.id, userId));
      
      // Get user's chats
      const userChats = await db
        .select({ chatId: chatParticipants.chatId })
        .from(chatParticipants)
        .where(eq(chatParticipants.userId, userId));
      
      // Join socket rooms for all user's chats
      userChats.forEach(chat => {
        socket.join(chat.chatId);
      });
      
      // Notify other users that this user is online
      io.emit('user_status_change', {
        userId,
        status: 'online'
      });
      
      // Handle joining a new chat
      socket.on('join_chat', async (chatId) => {
        try {
          // Check if user is a participant
          const [participant] = await db
            .select()
            .from(chatParticipants)
            .where(
              and(
                eq(chatParticipants.chatId, chatId),
                eq(chatParticipants.userId, userId)
              )
            )
            .limit(1);
          
          if (participant) {
            socket.join(chatId);
            console.log(`User ${userId} joined chat ${chatId}`);
          }
        } catch (error) {
          console.error('Error joining chat:', error);
        }
      });
      
      // Handle new message
      socket.on('new_message', (message) => {
        // Broadcast to all users in the chat room
        socket.to(message.chatId).emit('receive_message', message);
      });
      
      // Handle message status updates
      socket.on('message_status', async (data) => {
        try {
          const { messageId, status } = data;
          
          // Update message status in the database
          // This would be implemented in the real app
          
          // Broadcast status update to sender
          const message = await db
            .select()
            .from(messages)
            .where(eq(messages.id, messageId))
            .limit(1);
          
          if (message.length > 0) {
            const senderId = message[0].senderId;
            const senderSocketId = onlineUsers.get(senderId);
            
            if (senderSocketId) {
              io.to(senderSocketId).emit('message_status_update', {
                messageId,
                userId,
                status
              });
            }
          }
        } catch (error) {
          console.error('Error updating message status:', error);
        }
      });
      
      // Handle typing indicator
      socket.on('typing', (data) => {
        socket.to(data.chatId).emit('user_typing', {
          userId,
          chatId: data.chatId,
          isTyping: data.isTyping
        });
      });
      
      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${userId}`);
        
        // Remove user from online users map
        onlineUsers.delete(userId);
        
        // Update user status to offline
        await db.update(users)
          .set({
            status: 'offline',
            lastSeen: new Date()
          })
          .where(eq(users.id, userId));
        
        // Notify other users that this user is offline
        io.emit('user_status_change', {
          userId,
          status: 'offline',
          lastSeen: new Date().toISOString()
        });
      });
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  });

  return io;
};

module.exports = setupWebSocket;
