
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, Info, Users } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { format } from 'date-fns';

export default function ChatHeader() {
  const { currentChat, getChatName, getChatAvatar, getUserById } = useChat();

  if (!currentChat) {
    return <div className="p-4 border-b"></div>;
  }

  const getStatusText = () => {
    if (currentChat.isGroup) {
      return `${currentChat.participants.length} participants`;
    } else {
      const otherParticipantId = currentChat.participants.find(
        id => id !== 'user1' // Assuming current user is user1
      );
      
      if (!otherParticipantId) return 'No participants';
      
      const otherUser = getUserById(otherParticipantId);
      
      if (!otherUser) return '';
      
      if (otherUser.status === 'online') {
        return 'Online';
      } else if (otherUser.status === 'away') {
        return 'Away';
      } else if (otherUser.lastSeen) {
        const lastSeen = new Date(otherUser.lastSeen);
        return `Last seen ${format(lastSeen, 'MMM d, yyyy')}`;
      } else {
        return 'Offline';
      }
    }
  };

  return (
    <div className="p-3 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getChatAvatar(currentChat)} />
          <AvatarFallback>
            {currentChat.isGroup ? (
              <Users className="h-5 w-5" />
            ) : (
              getChatName(currentChat).substring(0, 2).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-sm">{getChatName(currentChat)}</h2>
          <p className="text-xs text-muted-foreground">{getStatusText()}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
