
/**
 * Message controller
 */
const { v4: uuidv4 } = require('uuid');
const { eq, and, gt } = require('drizzle-orm');
const { getDb } = require('../config/database');
const { messages, messageStatus, chatParticipants, users } = require('../models/schema');

/**
 * Get messages for a specific chat
 */
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { before, limit = 50 } = req.query;
    const userId = req.user.id;
    
    const db = getDb();
    
    // Check if the user is a participant in the chat
    const participant = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, userId)
        )
      )
      .limit(1);
    
    if (participant.length === 0) {
      return res.status(403).json({ error: 'You are not a participant in this chat' });
    }
    
    // Build query conditions
    let conditions = eq(messages.chatId, chatId);
    
    if (before) {
      conditions = and(
        conditions,
        gt(messages.createdAt, new Date(before))
      );
    }
    
    // Get messages
    const chatMessages = await db
      .select()
      .from(messages)
      .where(conditions)
      .orderBy(messages.createdAt, 'desc')
      .limit(Number(limit));
    
    // Get sender information for each message
    const messagesWithSenders = await Promise.all(
      chatMessages.map(async message => {
        const [sender] = await db
          .select({
            id: users.id,
            username: users.username,
            avatar: users.avatar
          })
          .from(users)
          .where(eq(users.id, message.senderId))
          .limit(1);
        
        // Get message status for all participants
        const statuses = await db
          .select()
          .from(messageStatus)
          .where(eq(messageStatus.messageId, message.id));
        
        return {
          ...message,
          sender,
          status: statuses.map(status => ({
            userId: status.userId,
            status: status.status,
            readAt: status.readAt
          }))
        };
      })
    );
    
    // Mark messages as read for the current user
    for (const message of chatMessages) {
      if (message.senderId !== userId) {
        // Check if a status record already exists
        const [existingStatus] = await db
          .select()
          .from(messageStatus)
          .where(
            and(
              eq(messageStatus.messageId, message.id),
              eq(messageStatus.userId, userId)
            )
          )
          .limit(1);
        
        if (existingStatus) {
          // Update existing status
          if (existingStatus.status !== 'read') {
            await db
              .update(messageStatus)
              .set({
                status: 'read',
                readAt: new Date()
              })
              .where(eq(messageStatus.id, existingStatus.id));
          }
        } else {
          // Create new status record
          await db
            .insert(messageStatus)
            .values({
              id: uuidv4(),
              messageId: message.id,
              userId,
              status: 'read',
              readAt: new Date()
            });
        }
      }
    }
    
    return res.status(200).json({
      messages: messagesWithSenders.reverse() // Return in ascending order
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    return res.status(500).json({ error: 'Server error while fetching messages' });
  }
};

/**
 * Send a new message to a chat
 */
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', mediaUrl } = req.body;
    const userId = req.user.id;
    
    if (!content && !mediaUrl) {
      return res.status(400).json({ error: 'Message content or media is required' });
    }
    
    const db = getDb();
    
    // Check if the user is a participant in the chat
    const participant = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, userId)
        )
      )
      .limit(1);
    
    if (participant.length === 0) {
      return res.status(403).json({ error: 'You are not a participant in this chat' });
    }
    
    // Create the message
    const messageId = uuidv4();
    
    await db
      .insert(messages)
      .values({
        id: messageId,
        content: content || '',
        type,
        chatId,
        senderId: userId,
        mediaUrl: mediaUrl || null
      });
    
    // Get all chat participants
    const chatParticipantsList = await db
      .select()
      .from(chatParticipants)
      .where(eq(chatParticipants.chatId, chatId));
    
    // Create message status records for all participants
    for (const participant of chatParticipantsList) {
      await db
        .insert(messageStatus)
        .values({
          id: uuidv4(),
          messageId,
          userId: participant.userId,
          status: participant.userId === userId ? 'read' : 'sent',
          readAt: participant.userId === userId ? new Date() : null
        });
    }
    
    // Get the created message with sender
    const [newMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));
    
    const [sender] = await db
      .select({
        id: users.id,
        username: users.username,
        avatar: users.avatar
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    const statuses = await db
      .select()
      .from(messageStatus)
      .where(eq(messageStatus.messageId, messageId));
    
    const messageWithDetails = {
      ...newMessage,
      sender,
      status: statuses.map(status => ({
        userId: status.userId,
        status: status.status,
        readAt: status.readAt
      }))
    };
    
    return res.status(201).json({
      message: 'Message sent successfully',
      messageData: messageWithDetails
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Server error while sending message' });
  }
};

module.exports = {
  getChatMessages,
  sendMessage
};
