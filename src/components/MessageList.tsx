
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MessageList() {
  const { messages, getUserById } = useChat();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: typeof messages }[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      let dateStr = '';
      
      if (isToday(messageDate)) {
        dateStr = 'Today';
      } else if (isYesterday(messageDate)) {
        dateStr = 'Yesterday';
      } else {
        dateStr = format(messageDate, 'MMMM d, yyyy');
      }
      
      const existingGroup = groups.find(g => g.date === dateStr);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: dateStr, messages: [message] });
      }
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-6">
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  {group.date}
                </span>
                <div className="absolute inset-0 flex items-center">
                  <span className="border-t w-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {group.messages.map((message, messageIndex) => {
                  const isSender = message.sender === user?.id;
                  const sender = getUserById(message.sender);
                  const time = format(new Date(message.timestamp), 'HH:mm');
                  const isConsecutive = messageIndex > 0 && 
                                      group.messages[messageIndex - 1].sender === message.sender;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={cn("flex", isSender ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("flex max-w-[75%]", isSender ? "flex-row-reverse" : "flex-row")}>
                        {!isConsecutive && !isSender && (
                          <Avatar className="h-8 w-8 mt-1 mx-2 flex-shrink-0">
                            <AvatarImage src={sender?.avatar} />
                            <AvatarFallback>
                              {sender?.username.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        {isConsecutive && !isSender && <div className="w-12" />}
                        
                        <div className={cn("flex flex-col", isSender ? "items-end" : "items-start")}>
                          {!isConsecutive && !isSender && (
                            <span className="text-xs text-muted-foreground mb-1 ml-1">
                              {sender?.username}
                            </span>
                          )}
                          
                          <div className={cn(
                            "message-bubble",
                            isSender ? "sent" : "received"
                          )}>
                            {message.type === 'text' && message.content}
                            
                            {message.type === 'image' && (
                              <img 
                                src={message.mediaUrl} 
                                alt="Image" 
                                className="rounded max-w-full h-auto max-h-60 cursor-pointer" 
                              />
                            )}
                            
                            {message.type === 'video' && (
                              <video 
                                src={message.mediaUrl} 
                                controls 
                                className="rounded max-w-full h-auto max-h-60" 
                              />
                            )}
                            
                            {message.type === 'file' && (
                              <div className="flex items-center space-x-2 bg-background/30 rounded p-2">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{message.mediaUrl}</span>
                              </div>
                            )}
                            
                            <span className="text-xs opacity-70 mt-1 inline-block">
                              {time}
                              {isSender && (
                                <span className="ml-1">
                                  {message.status === 'read' ? '✓✓' : 
                                   message.status === 'delivered' ? '✓✓' : '✓'}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  );
}
