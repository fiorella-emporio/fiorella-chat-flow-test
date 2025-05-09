
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { Plus } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newName: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <Button 
          onClick={onNewConversation} 
          className="w-full bg-fiorella-primary hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Nenhuma conversa iniciada
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onRename={onRenameConversation}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
