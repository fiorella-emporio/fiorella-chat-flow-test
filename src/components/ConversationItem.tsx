
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Edit, Trash2, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(conversation.name);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Last message preview
  const lastMessage = conversation.messages.length > 0 
    ? conversation.messages[conversation.messages.length - 1].text
    : "Nenhuma mensagem";
  
  // Format date
  const formattedDate = format(
    new Date(conversation.lastUpdated),
    conversation.lastUpdated > Date.now() - 24 * 60 * 60 * 1000 
      ? 'HH:mm' 
      : 'dd/MM',
    { locale: ptBR }
  );
  
  // Auto focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Handle save or cancel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && 
          inputRef.current && 
          !inputRef.current.contains(event.target as Node)) {
        handleSave();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, newName]);
  
  const handleSave = () => {
    if (newName.trim()) {
      onRename(conversation.id, newName);
    } else {
      setNewName(conversation.name);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setNewName(conversation.name);
      setIsEditing(false);
    }
  };
  
  return (
    <div
      className={cn(
        "border-b border-gray-100 p-3 cursor-pointer transition-colors",
        isActive ? "bg-fiorella-primary bg-opacity-10" : "hover:bg-gray-50"
      )}
      onClick={() => !isEditing && onSelect(conversation.id)}
    >
      <div className="flex justify-between items-start">
        {isEditing ? (
          <div className="flex flex-1 items-center">
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8 text-sm py-1"
              maxLength={30}
            />
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setNewName(conversation.name);
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 text-fiorella-primary mr-2" />
                <h3 className="font-medium text-sm line-clamp-1">{conversation.name}</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {lastMessage.length > 30 ? `${lastMessage.substring(0, 30)}...` : lastMessage}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">{formattedDate}</span>
              <div className="flex mt-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
