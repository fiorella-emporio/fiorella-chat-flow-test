
import { useEffect, useState } from "react";
import { Conversation, Message } from "@/types/chat";
import { sendMessageToAgent } from "@/services/chatService";
import { toast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = "fiorella-chat-conversations";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        
        // Set active conversation to the most recently updated one if available
        if (parsedConversations.length > 0 && !activeConversationId) {
          setActiveConversationId(parsedConversations[0].id);
        }
      } catch (error) {
        console.error("Error parsing saved conversations:", error);
      }
    }
  }, []);
  
  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);
  
  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || null;
  
  const createNewConversation = (name: string = "Nova conversa") => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      messages: [],
      lastUpdated: Date.now()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    return newConversation;
  };
  
  const renameConversation = (conversationId: string, newName: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, name: newName } 
          : conv
      )
    );
  };
  
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (activeConversationId === conversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
    }
  };
  
  const selectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    let currentConversationId = activeConversationId;
    
    // If no active conversation, create a new one
    if (!currentConversationId) {
      const newConv = createNewConversation();
      currentConversationId = newConv.id;
    }
    
    // Create user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      text,
      sender: "user",
      timestamp: Date.now(),
      delivered: true,
    };
    
    // Add user message to conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, userMessage],
              lastUpdated: Date.now()
            } 
          : conv
      )
    );
    
    // Show agent typing indicator
    setIsAgentTyping(true);
    
    try {
      // Send to n8n and get response
      const agentResponse = await sendMessageToAgent(currentConversationId, text);
      
      // Wait a bit to simulate typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add agent response to conversation
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                messages: [...conv.messages, agentResponse],
                lastUpdated: Date.now()
              } 
            : conv
        )
      );
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter resposta do agente",
        variant: "destructive"
      });
    } finally {
      setIsAgentTyping(false);
    }
  };
  
  return {
    conversations,
    activeConversation,
    isAgentTyping,
    createNewConversation,
    renameConversation,
    deleteConversation,
    selectConversation,
    sendMessage
  };
}
