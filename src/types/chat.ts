
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
  delivered: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  lastUpdated: number;
}
