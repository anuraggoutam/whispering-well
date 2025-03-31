
/**
 * Chat controller
 */
const { v4: uuidv4 } = require('uuid');
const { eq, and, or, inArray } = require('drizzle-orm');
const { getDb } = require('../config/database');
const { chats, chatParticipants, users, messages, messageStatus } = require('../models/schema');

/**
 * Get all chats for the current user
 */
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    
    // Get all chat IDs where the user is a participant
    const userChatsParticipants = await db
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, userId));
    
    const chatIds = userChatsParticipants.map(c => c.chatId);
    
    if (chatIds.length === 0) {
      return res.status(200).json({ chats: [] });
    }
    
    // Get all chats
    const userChats = await db
      .select()
      .from(chats)
      .where(inArray(chats.id, chatIds));
    
    // Get participants for each chat
    const enrichedChats = await Promise.all(
      userChats.map(async chat => {
        // Get participants
        const participants = await db
          .select({
            userId: chatParticipants.userId,
            username: users.username,
            avatar: users.avatar,
            status: users.status,
            lastSeen: users.lastSeen
          })
          .from(chatParticipants)
          .leftJoin(users, eq(chatParticipants.userId, users.id))
          .where(eq(chatParticipants.chatId, chat.id));
        
        // Get last message
        const [lastMessage] = await db
          .select()
          .from(messages)
          .where(eq(messages.chatId, chat.id))
          .orderBy(messages.createdAt, 'desc')
          .limit(1);
        
        // Get unread count
        const unreadMessages = await db
          .select({ count: messages.id })
          .from(messages)
          .leftJoin(messageStatus, eq(messages.id, messageStatus.messageId))
          .where(
            and(
              eq(messages.chatId, chat.id),
              eq(messages.senderId, userId, true), // Messages not sent by the current user
              or(
                eq(messageStatus.status, 'read', true), // Message not marked as read
                eq(messageStatus.userId, userId, true)  // No status record for the current user
              )
            )
          );
        
        return {
          ...chat,
          participants,
          lastMessage: lastMessage || null,
          unreadCount: unreadMessages.length
        };
      })
    );
    
    return res.status(200).json({ chats: enrichedChats });
  } catch (error) {
    console.error('Get user chats error:', error);
    return res.status(500).json({ error: 'Server error while fetching chats' });
  }
};

/**
 * Create a new chat
 */
const createChat = async (req, res) => {
  try {
    const { name, isGroup, participants } = req.body;
    const userId = req.user.id;
    
    if (isGroup && !name) {
      return res.status(400).json({ error: 'Group name is required' });
    }
    
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: 'At least one participant is required' });
    }
    
    // Make sure the current user is included as a participant
    const allParticipants = [...new Set([...participants, userId])];
    
    const db = getDb();
    
    // For direct chats, check if a chat already exists with the same participants
    if (!isGroup && allParticipants.length === 2) {
      // Get all 1-on-1 chats where the current user is a participant
      const userChats = await db
        .select({ chatId: chatParticipants.chatId })
        .from(chatParticipants)
        .where(eq(chatParticipants.userId, userId));
      
      const userChatIds = userChats.map(c => c.chatId);
      
      if (userChatIds.length > 0) {
        // Get all chats that are not groups
        const nonGroupChats = await db
          .select()
          .from(chats)
          .where(
            and(
              inArray(chats.id, userChatIds),
              eq(chats.isGroup, false)
            )
          );
        
        // For each non-group chat, check if the other participant is in the requested participants
        for (const chat of nonGroupChats) {
          const chatParticipantsList = await db
            .select({ userId: chatParticipants.userId })
            .from(chatParticipants)
            .where(eq(chatParticipants.chatId, chat.id));
          
          const participantIds = chatParticipantsList.map(p => p.userId);
          
          // If the chat has exactly the same participants, return it
          if (participantIds.length === 2 && 
              participantIds.includes(userId) && 
              participantIds.includes(allParticipants.find(p => p !== userId))) {
            
            // Get full chat details with participants
            const [existingChat] = await db
              .select()
              .from(chats)
              .where(eq(chats.id, chat.id));
            
            const participants = await db
              .select({
                userId: chatParticipants.userId,
                username: users.username,
                avatar: users.avatar,
                status: users.status
              })
              .from(chatParticipants)
              .leftJoin(users, eq(chatParticipants.userId, users.id))
              .where(eq(chatParticipants.chatId, chat.id));
            
            return res.status(200).json({
              message: 'Chat already exists',
              chat: {
                ...existingChat,
                participants
              }
            });
          }
        }
      }
    }
    
    // Create a new chat
    const chatId = uuidv4();
    
    await db.insert(chats).values({
      id: chatId,
      name: isGroup ? name : null,
      isGroup
    });
    
    // Add participants
    for (const participantId of allParticipants) {
      await db.insert(chatParticipants).values({
        id: uuidv4(),
        chatId,
        userId: participantId
      });
    }
    
    // Get the newly created chat with participants
    const [newChat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId));
    
    const participants = await db
      .select({
        userId: chatParticipants.userId,
        username: users.username,
        avatar: users.avatar,
        status: users.status
      })
      .from(chatParticipants)
      .leftJoin(users, eq(chatParticipants.userId, users.id))
      .where(eq(chatParticipants.chatId, chatId));
    
    return res.status(201).json({
      message: 'Chat created successfully',
      chat: {
        ...newChat,
        participants
      }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    return res.status(500).json({ error: 'Server error while creating chat' });
  }
};

/**
 * Get a specific chat by ID
 */
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
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
    
    // Get the chat
    const [chat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId));
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Get participants
    const participants = await db
      .select({
        userId: chatParticipants.userId,
        username: users.username,
        avatar: users.avatar,
        status: users.status,
        lastSeen: users.lastSeen
      })
      .from(chatParticipants)
      .leftJoin(users, eq(chatParticipants.userId, users.id))
      .where(eq(chatParticipants.chatId, chatId));
    
    // Get last message
    const [lastMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt, 'desc')
      .limit(1);
    
    return res.status(200).json({
      chat: {
        ...chat,
        participants,
        lastMessage: lastMessage || null
      }
    });
  } catch (error) {
    console.error('Get chat by ID error:', error);
    return res.status(500).json({ error: 'Server error while fetching chat' });
  }
};

module.exports = {
  getUserChats,
  createChat,
  getChatById
};
