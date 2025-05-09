
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import AgentTypingIndicator from "./AgentTypingIndicator";
import { Conversation } from "@/types/chat";

interface ChatWindowProps {
  conversation: Conversation | null;
  isAgentTyping: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatWindow({ conversation, isAgentTyping, onSendMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, isAgentTyping]);
  
  if (!conversation) {
    return (
      <div className="flex flex-col h-[100dvh] items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bem-vindo ao Chat Fiorella</h2>
          <p className="text-gray-500 mb-6">Inicie uma nova conversa para testar o agente inteligente.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 text-center">
              Inicie uma conversa com o agente inteligente.
            </p>
          </div>
        ) : (
          <>
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isAgentTyping && <AgentTypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <MessageInput 
        onSendMessage={onSendMessage} 
        disabled={isAgentTyping} 
      />
    </div>
  );
}
