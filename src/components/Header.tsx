
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

export default function Header({ showSidebar, toggleSidebar }: HeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between border-b bg-white p-3 sticky top-0 z-10">
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center">
          {/* On mobile, show only the logo */}
          {/* <img 
            src="/lovable-uploads/524cc768-98d2-4c01-a333-c10ebd3c7b4f.png" 
            alt="Fiorella Logo" 
            className="h-8 md:h-6 mr-2" 
          /> */}
          <div className="flex items-center">   
            <span className="text-fiorella-primary font-bold text-xl">Fiorella</span>
          {!isMobile && (                        
              <span className="ml-1 text-gray-800 font-medium text-sm">Empório e Padaria</span>
            )}
          </div>    
        </div>
      </div>
      
      {!isMobile && (
        <div className="text-xs text-gray-500">
          Sistema de Chat - Teste de Agente Inteligente
        </div>
      )}
    </div>
  );
}
