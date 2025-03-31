
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/mockData';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewChatDialog({ open, onOpenChange }: NewChatDialogProps) {
  const { createChat } = useChat();
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [tab, setTab] = useState<string>('direct');

  const otherUsers = users.filter(u => u.id !== user?.id);

  const handleSubmit = () => {
    if (tab === 'direct' && selectedUsers.length === 1) {
      createChat([selectedUsers[0]], false);
      resetAndClose();
    } else if (tab === 'group' && selectedUsers.length > 0 && groupName) {
      createChat(selectedUsers, true, groupName);
      resetAndClose();
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const resetAndClose = () => {
    setSelectedUsers([]);
    setGroupName('');
    setTab('direct');
    onOpenChange(false);
  };

  const isSubmitDisabled = 
    (tab === 'direct' && selectedUsers.length !== 1) || 
    (tab === 'group' && (selectedUsers.length === 0 || !groupName));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="direct" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct Message</TabsTrigger>
            <TabsTrigger value="group">Group Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select a user to start a conversation
            </p>
          </TabsContent>
          
          <TabsContent value="group" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Select users to add to the group
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <ScrollArea className="h-72">
          <div className="space-y-2">
            {otherUsers.map(otherUser => (
              <div 
                key={otherUser.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                onClick={() => {
                  if (tab === 'direct') {
                    setSelectedUsers([otherUser.id]);
                  } else {
                    toggleUserSelection(otherUser.id);
                  }
                }}
              >
                <Avatar>
                  <AvatarImage src={otherUser.avatar} />
                  <AvatarFallback>{otherUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{otherUser.username}</div>
                  <div className="text-xs text-muted-foreground">{otherUser.email}</div>
                </div>
                {tab === 'group' ? (
                  <Checkbox
                    checked={selectedUsers.includes(otherUser.id)}
                    onCheckedChange={() => toggleUserSelection(otherUser.id)}
                  />
                ) : (
                  <div 
                    className={`w-4 h-4 rounded-full ${
                      selectedUsers.includes(otherUser.id) 
                        ? 'bg-primary' 
                        : 'border border-muted-foreground'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {tab === 'direct' ? 'Start Chat' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
