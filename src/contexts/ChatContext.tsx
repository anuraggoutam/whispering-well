
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { chats as mockChats, messages as mockMessages, User, Message, Chat } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, type: Message['type'], mediaUrl?: string) => void;
  selectChat: (chatId: string) => void;
  createChat: (participants: string[], isGroup: boolean, name?: string) => void;
  getUserById: (userId: string) => User | undefined;
  getChatName: (chat: Chat) => string;
  getChatAvatar: (chat: Chat) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    if (user) {
      // Fetch chats from mock data
      setChats(mockChats);
      
      // Import mock users into a lookup object
      import('@/data/mockData').then(({ users }) => {
        const userMap: Record<string, User> = {};
        users.forEach(user => {
          userMap[user.id] = user;
        });
        setUsers(userMap);
      });
    }
  }, [user]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (currentChat) {
      setMessages(mockMessages[currentChat.id] || []);
    }
  }, [currentChat]);

  const selectChat = (chatId: string) => {
    setIsLoading(true);
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
      
      // Mark messages as read (would be an API call in a real app)
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      );
      setChats(updatedChats);
    }
    setIsLoading(false);
  };

  const sendMessage = (content: string, type: Message['type'] = 'text', mediaUrl?: string) => {
    if (!currentChat || !user) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      content,
      sender: user.id,
      chatId: currentChat.id,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type,
      ...(mediaUrl && { mediaUrl }),
    };

    // Add to messages
    setMessages(prev => [...prev, newMessage]);

    // Update chat's last message
    const updatedChats = chats.map(chat => 
      chat.id === currentChat.id 
        ? { 
            ...chat, 
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
          } 
        : chat
    );
    setChats(updatedChats);

    // Simulate response for demo (would be done via WebSockets in a real app)
    if (currentChat.id === 'chat1' || currentChat.id === 'chat2') {
      setTimeout(() => {
        const responseMessage: Message = {
          id: `msg${Date.now() + 1}`,
          content: `This is an automatic response to your message: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`,
          sender: currentChat.participants.find(p => p !== user.id) || '',
          chatId: currentChat.id,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          type: 'text',
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const createChat = (participants: string[], isGroup: boolean, name?: string) => {
    if (!user) return;
    
    // Ensure current user is included
    if (!participants.includes(user.id)) {
      participants.push(user.id);
    }
    
    const newChat: Chat = {
      id: `chat${Date.now()}`,
      name: isGroup ? name : undefined,
      isGroup,
      participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setChats(prev => [newChat, ...prev]);
    
    toast({
      title: 'Chat created',
      description: isGroup ? `Group "${name}" created successfully` : 'Chat started successfully',
    });
    
    // Select the new chat
    setCurrentChat(newChat);
  };

  const getUserById = (userId: string): User | undefined => {
    return users[userId];
  };

  const getChatName = (chat: Chat): string => {
    if (!user) return '';
    
    if (chat.name) return chat.name;
    
    if (!chat.isGroup) {
      const otherParticipantId = chat.participants.find(id => id !== user.id);
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser?.username || 'Unknown User';
      }
    }
    
    return 'Chat';
  };

  const getChatAvatar = (chat: Chat): string => {
    if (!user) return '';
    
    if (!chat.isGroup) {
      const otherParticipantId = chat.participants.find(id => id !== user.id);
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser?.avatar || '';
      }
    }
    
    // Default group avatar
    return 'https://placehold.co/200/3498db/ffffff?text=Group';
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        isLoading,
        sendMessage,
        selectChat,
        createChat,
        getUserById,
        getChatName,
        getChatAvatar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
