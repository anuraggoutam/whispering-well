
# WhisperChat Server

Backend server for the WhisperChat application. This server provides APIs for user authentication, chat management, messaging, and file uploads.

## Features

- User authentication with JWT
- Real-time messaging using WebSockets
- Chat management (1-on-1 and group chats)
- File uploads for sharing media
- MySQL database with Drizzle ORM

## Prerequisites

- Node.js (v14+ recommended)
- MySQL database

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration
5. Create the MySQL database:
   ```sql
   CREATE DATABASE whisperchat;
   ```
6. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `POST /api/auth/logout` - Logout (requires authentication)

### Chats

- `GET /api/chats` - Get all chats for the current user (requires authentication)
- `POST /api/chats` - Create a new chat (requires authentication)
- `GET /api/chats/:chatId` - Get chat by ID (requires authentication)

### Messages

- `GET /api/messages/:chatId` - Get messages for a specific chat (requires authentication)
- `POST /api/messages/:chatId` - Send a new message to a chat (requires authentication)

### File Upload

- `POST /api/upload` - Upload a file (requires authentication)

## WebSocket Events

### Client Events (Emit)

- `join_chat` - Join a chat room
- `new_message` - Send a new message
- `message_status` - Update message status
- `typing` - Typing indicator

### Server Events (Listen)

- `receive_message` - Receive a new message
- `message_status_update` - Message status update
- `user_typing` - User is typing
- `user_status_change` - User status change (online/offline)

## Database Schema

- `users` - User information
- `chats` - Chat information
- `chat_participants` - Link between users and chats
- `messages` - Chat messages
- `message_status` - Status of messages (sent, delivered, read)

## Security Features

- Password encryption with bcrypt
- JWT-based authentication
- Rate limiting for API endpoints
- Helmet for HTTP header security
