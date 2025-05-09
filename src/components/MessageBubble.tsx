
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.sender === "agent";
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isAgent ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-2 shadow-sm",
        isAgent ? "message-bubble-agent" : "message-bubble-user"
      )}>
        <div className="flex flex-col">
          <div className="text-sm break-words">
            {message.text}
          </div>
          <div className={cn(
            "text-xs mt-1 text-right",
            isAgent ? "text-gray-500" : "text-gray-200"
          )}>
            {format(new Date(message.timestamp), 'HH:mm', { locale: ptBR })}
          </div>
        </div>
      </div>
    </div>
  );
}
