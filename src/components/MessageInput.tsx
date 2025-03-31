
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Paperclip, Mic, Send, Image, File, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useChat } from '@/contexts/ChatContext';

export default function MessageInput() {
  const { currentChat, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [attachment, setAttachment] = useState<{
    file: File | null;
    preview: string | null;
    type: 'image' | 'video' | 'file' | null;
  }>({
    file: null,
    preview: null,
    type: null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentChat) return;
    
    if (attachment.file && attachment.type) {
      // In a real app, we'd upload the file to a server and get a URL back
      // For demo purposes, we'll use the preview URL for images or a placeholder for files
      const mediaUrl = attachment.type === 'image' 
        ? attachment.preview 
        : attachment.file.name;
      
      sendMessage(message, attachment.type, mediaUrl || undefined);
      setAttachment({ file: null, preview: null, type: null });
    } else if (message.trim()) {
      sendMessage(message, 'text');
    }
    
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          file,
          preview: reader.result as string,
          type: file.type.startsWith('video/') ? 'video' : 'image',
        });
      };
      reader.readAsDataURL(file);
    } else {
      setAttachment({
        file,
        preview: null,
        type: 'file',
      });
    }
    
    setIsAttachmentOpen(false);
  };

  const removeAttachment = () => {
    setAttachment({ file: null, preview: null, type: null });
  };

  if (!currentChat) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t">
      {attachment.file && (
        <div className="mb-2 p-2 border rounded flex items-center justify-between">
          {attachment.type === 'image' && attachment.preview && (
            <div className="flex items-center">
              <img 
                src={attachment.preview} 
                alt="Attachment preview" 
                className="h-10 w-10 object-cover rounded mr-2" 
              />
              <span className="text-sm truncate max-w-[200px]">{attachment.file.name}</span>
            </div>
          )}
          
          {attachment.type === 'file' && (
            <div className="flex items-center">
              <File className="h-10 w-10 p-2" />
              <span className="text-sm truncate max-w-[200px]">{attachment.file.name}</span>
            </div>
          )}
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={removeAttachment} 
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Popover open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-48">
            <div className="flex flex-col space-y-1">
              <Button 
                type="button" 
                variant="ghost" 
                className="justify-start" 
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-2" />
                Photo/Video
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="justify-start" 
                onClick={() => fileInputRef.current?.click()}
              >
                <File className="h-4 w-4 mr-2" />
                Document
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, 'image')}
          accept="image/*,video/*"
          className="hidden"
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, 'file')}
          className="hidden"
        />
        
        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
          <Smile className="h-5 w-5" />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        
        {!message && !attachment.file ? (
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
            <Mic className="h-5 w-5" />
          </Button>
        ) : (
          <Button type="submit" size="icon" className="text-primary-foreground">
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
