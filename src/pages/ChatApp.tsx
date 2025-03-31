
import React from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { useChat } from '@/contexts/ChatContext';
import { MessageSquare } from 'lucide-react';

export default function ChatApp() {
  const { currentChat } = useChat();

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-80 flex-shrink-0">
        <ChatSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        
        {currentChat ? (
          <>
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground max-w-md">
              Choose a conversation from the sidebar or start a new one by clicking the plus button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
