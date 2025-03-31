
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, LogOut, Plus } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import NewChatDialog from './NewChatDialog';

export default function ChatSidebar() {
  const { chats, selectChat, currentChat, getChatName, getChatAvatar } = useChat();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const filteredChats = chats.filter(chat => 
    getChatName(chat).toLowerCase().includes(search.toLowerCase())
  );

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  const getLastMessagePreview = (chat: any) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    if (chat.lastMessage.type === 'text') {
      return chat.lastMessage.content.length > 25 
        ? `${chat.lastMessage.content.substring(0, 25)}...` 
        : chat.lastMessage.content;
    } else if (chat.lastMessage.type === 'image') {
      return '🖼️ Image';
    } else if (chat.lastMessage.type === 'video') {
      return '🎥 Video';
    } else if (chat.lastMessage.type === 'file') {
      return '📎 File';
    }
    
    return 'Message';
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-r">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">{user?.username}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="px-4 pb-2 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="icon" onClick={() => setIsNewChatOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No chats found
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                className={cn(
                  "p-2 rounded-lg transition-colors flex gap-3 items-center cursor-pointer hover:bg-secondary/50",
                  currentChat?.id === chat.id && "bg-secondary"
                )}
                onClick={() => selectChat(chat.id)}
              >
                <Avatar>
                  <AvatarImage src={getChatAvatar(chat)} />
                  <AvatarFallback>
                    {chat.isGroup ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getChatName(chat).substring(0, 2).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm truncate">{getChatName(chat)}</h3>
                    {chat.updatedAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(chat.updatedAt)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate">
                      {getLastMessagePreview(chat)}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <NewChatDialog 
        open={isNewChatOpen} 
        onOpenChange={setIsNewChatOpen} 
      />
    </div>
  );
}
