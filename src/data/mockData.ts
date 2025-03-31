
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  receiver?: string;
  chatId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export const currentUser: User = {
  id: 'user1',
  username: 'JaneDoe',
  email: 'jane@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  status: 'online'
};

export const users: User[] = [
  currentUser,
  {
    id: 'user2',
    username: 'JohnSmith',
    email: 'john@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'online'
  },
  {
    id: 'user3',
    username: 'AliWong',
    email: 'ali@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'offline',
    lastSeen: '2023-09-15T14:30:00Z'
  },
  {
    id: 'user4',
    username: 'MikeJohnson',
    email: 'mike@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    status: 'away'
  },
  {
    id: 'user5',
    username: 'SarahParker',
    email: 'sarah@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    status: 'online'
  }
];

export const chats: Chat[] = [
  {
    id: 'chat1',
    isGroup: false,
    participants: ['user1', 'user2'],
    unreadCount: 0,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-15T16:45:00Z'
  },
  {
    id: 'chat2',
    isGroup: false,
    participants: ['user1', 'user3'],
    unreadCount: 3,
    createdAt: '2023-08-15T09:30:00Z',
    updatedAt: '2023-09-15T13:20:00Z'
  },
  {
    id: 'chat3',
    name: 'Project Team',
    isGroup: true,
    participants: ['user1', 'user2', 'user3', 'user4'],
    unreadCount: 12,
    createdAt: '2023-07-20T14:25:00Z',
    updatedAt: '2023-09-15T17:10:00Z'
  },
  {
    id: 'chat4',
    isGroup: false,
    participants: ['user1', 'user5'],
    unreadCount: 0,
    createdAt: '2023-09-10T11:15:00Z',
    updatedAt: '2023-09-14T09:05:00Z'
  }
];

export const messages: Record<string, Message[]> = {
  'chat1': [
    {
      id: 'msg1',
      content: 'Hey Jane, how are you doing today?',
      sender: 'user2',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:30:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg2',
      content: 'I\'m good, thanks! Just working on the new project. How about you?',
      sender: 'user1',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:32:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg3',
      content: 'Same here. The deadline is approaching, but I think we\'re on track.',
      sender: 'user2',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:35:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg4',
      content: 'Check out this mockup I created:',
      sender: 'user2',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:36:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg5',
      content: '',
      sender: 'user2',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:37:00Z',
      status: 'read',
      type: 'image',
      mediaUrl: 'https://placehold.co/600x400/3498db/ffffff?text=Project+Mockup'
    },
    {
      id: 'msg6',
      content: 'Looks great! I especially like the navigation design.',
      sender: 'user1',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:40:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg7',
      content: 'Thanks! I was inspired by the material design guidelines.',
      sender: 'user2',
      chatId: 'chat1',
      timestamp: '2023-09-15T16:45:00Z',
      status: 'delivered',
      type: 'text'
    }
  ],
  'chat2': [
    {
      id: 'msg8',
      content: 'Hi Jane, do you have time for a quick call?',
      sender: 'user3',
      chatId: 'chat2',
      timestamp: '2023-09-15T13:10:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg9',
      content: 'I need to discuss the client presentation for tomorrow.',
      sender: 'user3',
      chatId: 'chat2',
      timestamp: '2023-09-15T13:12:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg10',
      content: 'Also, here\'s the document I mentioned:',
      sender: 'user3',
      chatId: 'chat2',
      timestamp: '2023-09-15T13:15:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg11',
      content: '',
      sender: 'user3',
      chatId: 'chat2',
      timestamp: '2023-09-15T13:16:00Z',
      status: 'delivered',
      type: 'file',
      mediaUrl: 'presentation.pdf'
    },
    {
      id: 'msg12',
      content: 'Let me know what you think!',
      sender: 'user3',
      chatId: 'chat2',
      timestamp: '2023-09-15T13:20:00Z',
      status: 'delivered',
      type: 'text'
    }
  ],
  'chat3': [
    {
      id: 'msg13',
      content: 'Team meeting at 3 PM today, don\'t forget!',
      sender: 'user4',
      chatId: 'chat3',
      timestamp: '2023-09-15T09:00:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg14',
      content: 'I\'ll be there. Any specific agenda?',
      sender: 'user2',
      chatId: 'chat3',
      timestamp: '2023-09-15T09:15:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg15',
      content: 'We need to finalize the Q4 roadmap and assign tasks.',
      sender: 'user4',
      chatId: 'chat3',
      timestamp: '2023-09-15T09:20:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg16',
      content: 'I\'ve prepared a presentation:',
      sender: 'user3',
      chatId: 'chat3',
      timestamp: '2023-09-15T10:30:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg17',
      content: '',
      sender: 'user3',
      chatId: 'chat3',
      timestamp: '2023-09-15T10:31:00Z',
      status: 'read',
      type: 'file',
      mediaUrl: 'roadmap.pptx'
    },
    {
      id: 'msg18',
      content: 'Thanks Ali, this looks comprehensive!',
      sender: 'user1',
      chatId: 'chat3',
      timestamp: '2023-09-15T11:00:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg19',
      content: 'Here\'s a screenshot of the latest analytics:',
      sender: 'user5',
      chatId: 'chat3',
      timestamp: '2023-09-15T14:20:00Z',
      status: 'delivered',
      type: 'image',
      mediaUrl: 'https://placehold.co/800x400/3498db/ffffff?text=Analytics+Dashboard'
    },
    {
      id: 'msg20',
      content: 'We\'ve seen a 24% increase in user engagement!',
      sender: 'user5',
      chatId: 'chat3',
      timestamp: '2023-09-15T14:22:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg21',
      content: 'That\'s great news, Sarah!',
      sender: 'user4',
      chatId: 'chat3',
      timestamp: '2023-09-15T14:25:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg22',
      content: 'Don\'t forget to prepare your progress reports for the meeting.',
      sender: 'user4',
      chatId: 'chat3',
      timestamp: '2023-09-15T15:00:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg23',
      content: 'Already done!',
      sender: 'user2',
      chatId: 'chat3',
      timestamp: '2023-09-15T15:05:00Z',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'msg24',
      content: 'I\'ll finish mine before the meeting.',
      sender: 'user1',
      chatId: 'chat3',
      timestamp: '2023-09-15T15:10:00Z',
      status: 'delivered',
      type: 'text'
    }
  ],
  'chat4': [
    {
      id: 'msg25',
      content: 'Hi Jane, are you coming to the company picnic this weekend?',
      sender: 'user5',
      chatId: 'chat4',
      timestamp: '2023-09-14T08:30:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg26',
      content: 'Yes, I\'m planning to! It should be fun.',
      sender: 'user1',
      chatId: 'chat4',
      timestamp: '2023-09-14T08:45:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg27',
      content: 'Great! I\'m bringing some homemade cookies.',
      sender: 'user5',
      chatId: 'chat4',
      timestamp: '2023-09-14T08:50:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg28',
      content: 'Yum! I\'ll bring some drinks then.',
      sender: 'user1',
      chatId: 'chat4',
      timestamp: '2023-09-14T09:00:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg29',
      content: 'Perfect! See you there!',
      sender: 'user5',
      chatId: 'chat4',
      timestamp: '2023-09-14T09:05:00Z',
      status: 'read',
      type: 'text'
    }
  ]
};
