
import { cn } from "@/lib/utils";

export default function AgentTypingIndicator() {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="max-w-[80%] px-4 py-2 message-bubble-agent shadow-sm">
        <div className="flex space-x-1 items-center">
          <div className="text-sm">Agente está digitando</div>
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
