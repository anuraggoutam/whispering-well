
# WhisperChat - Full-Stack Chat Application

A real-time messaging application with support for one-on-one and group chats, file sharing, and secure user authentication.

## Project Structure

This project consists of two main parts:

1. **Frontend**: React-based application with a modern UI for real-time messaging
2. **Backend**: Node.js/Express server with WebSockets for real-time communication

## Features

- User authentication (login/signup) with JWT
- Real-time messaging using WebSockets
- One-on-one and group chats
- Message status (sent, delivered, read)
- File sharing (images, videos, documents)
- Online/offline status indicators
- Typing indicators
- Responsive design

## Frontend (React)

The frontend is built with:
- React
- TypeScript
- Tailwind CSS
- Shadcn UI components
- React Router for navigation
- Mock data for standalone functionality

### Running the Frontend

```
# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Credentials

For testing purposes, you can use:
- Email: jane@example.com
- Password: password123

## Backend (Node.js/Express)

The backend is built with:
- Node.js and Express
- MySQL with Drizzle ORM for data storage
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads

### Running the Backend

See the [server README](server/README.md) for detailed instructions.

```
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

## Database Schema

- **Users**: User accounts with authentication info
- **Chats**: Information about chat conversations
- **Chat Participants**: Linking users to chats
- **Messages**: The actual message content
- **Message Status**: Tracking message delivery/read status

## Security Features

- Password encryption with bcrypt
- JWT-based authentication
- HTTPS secure communications
- Rate limiting for API protection
- Input validation

## Deployment

### Frontend

The frontend can be deployed to any static hosting service:

```
npm run build
```

### Backend

The backend server can be deployed to any Node.js hosting service.

## Project Requirements

This project was developed to meet the following requirements:

1. **Database**: MySQL with Drizzle ORM
2. **Frontend**: React-based UI that displays chat output without needing an API connection
3. **Backend**: Node.js-based API server with Express
4. **Authentication**: JWT-based secure user login and signup
5. **Chat System**: Real-time messaging using WebSockets
6. **Notifications**: Real-time notifications for new messages
7. **Security**: Password encryption, secure JWT transmission, rate-limiting
8. **Media Sharing**: Support for images, videos, and documents

## License

This project is for educational purposes.
