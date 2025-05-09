
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const {
    conversations,
    activeConversation,
    isAgentTyping,
    createNewConversation,
    renameConversation,
    deleteConversation,
    selectConversation,
    sendMessage,
  } = useChat();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [newConversationName, setNewConversationName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleNewConversation = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      const newConv = createNewConversation();
      toast({
        title: "Nova conversa criada",
        description: `Conversa "${newConv.name}" iniciada com sucesso.`,
      });
    }
  };
  
  const handleCreateFromDialog = () => {
    const name = newConversationName.trim() || "Nova conversa";
    const newConv = createNewConversation(name);
    setNewConversationName("");
    setIsDialogOpen(false);
    toast({
      title: "Nova conversa criada",
      description: `Conversa "${name}" iniciada com sucesso.`,
    });
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    toast({
      title: "Conversa removida",
      description: "A conversa foi excluída com sucesso.",
    });
  };
  
  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <Header 
        showSidebar={showSidebar} 
        toggleSidebar={() => setShowSidebar(!showSidebar)} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {(showSidebar || !isMobile) && (
          <div className={`${isMobile ? 'absolute inset-y-0 left-0 z-20 w-72 bg-white h-[calc(100dvh-56px)] mt-14' : 'w-80'}`}>
            <ScrollArea className="h-full">
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?.id || null}
                onNewConversation={handleNewConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
                onRenameConversation={renameConversation}
              />
            </ScrollArea>
          </div>
        )}
        
        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            conversation={activeConversation}
            isAgentTyping={isAgentTyping}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
      
      {/* New Conversation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Nova Conversa</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Dê um nome para a nova conversa.
              </p>
            </div>
            <Input
              placeholder="Nome da conversa"
              value={newConversationName}
              onChange={(e) => setNewConversationName(e.target.value)}
              className="col-span-3"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateFromDialog}
                className="bg-fiorella-primary hover:bg-red-700"
              >
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
