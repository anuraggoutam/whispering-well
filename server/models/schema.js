
/**
 * Database schema definitions using Drizzle ORM
 */
const { mysqlTable, varchar, text, int, timestamp, boolean } = require('drizzle-orm/mysql-core');
const { relations } = require('drizzle-orm');

// Users table
const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  username: varchar('username', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  status: varchar('status', { length: 20 }).default('offline'),
  lastSeen: timestamp('last_seen'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

// Chats table
const chats = mysqlTable('chats', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  name: varchar('name', { length: 100 }),
  isGroup: boolean('is_group').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

// Chat participants
const chatParticipants = mysqlTable('chat_participants', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  chatId: varchar('chat_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
  leftAt: timestamp('left_at')
});

// Messages table
const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  content: text('content'),
  type: varchar('type', { length: 20 }).default('text').notNull(),
  chatId: varchar('chat_id', { length: 36 }).notNull(),
  senderId: varchar('sender_id', { length: 36 }).notNull(),
  mediaUrl: varchar('media_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

// Message status table
const messageStatus = mysqlTable('message_status', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  messageId: varchar('message_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 20 }).default('sent').notNull(),
  readAt: timestamp('read_at')
});

// Define relationships between tables
const usersRelations = relations(users, ({ many }) => ({
  participatedChats: many(chatParticipants),
  sentMessages: many(messages, { relationName: 'sender' }),
  messageStatuses: many(messageStatus)
}));

const chatsRelations = relations(chats, ({ many }) => ({
  participants: many(chatParticipants),
  messages: many(messages)
}));

const messagesRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender'
  }),
  statuses: many(messageStatus)
}));

const chatParticipantsRelations = relations(chatParticipants, ({ one }) => ({
  chat: one(chats, {
    fields: [chatParticipants.chatId],
    references: [chats.id]
  }),
  user: one(users, {
    fields: [chatParticipants.userId],
    references: [users.id]
  })
}));

const messageStatusRelations = relations(messageStatus, ({ one }) => ({
  message: one(messages, {
    fields: [messageStatus.messageId],
    references: [messages.id]
  }),
  user: one(users, {
    fields: [messageStatus.userId],
    references: [users.id]
  })
}));

module.exports = {
  users,
  chats,
  chatParticipants,
  messages,
  messageStatus,
  usersRelations,
  chatsRelations,
  messagesRelations,
  chatParticipantsRelations,
  messageStatusRelations
};
