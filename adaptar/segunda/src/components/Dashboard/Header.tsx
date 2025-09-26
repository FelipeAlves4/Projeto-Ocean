import { Menu, LogOut, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './UserProfile';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Saindo...",
      description: "Você será redirecionado para a página de login."
    });
  };

  return (
    <header className="flex items-center justify-between p-6 bg-background border-b border-border animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-ocean-primary/20 rounded-full blur-md animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-ocean-primary to-ocean-secondary p-2 rounded-full shadow-lg">
            <Waves className="h-5 w-5 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text text-transparent">
          Ocean
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <UserProfile />
        </div>
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sair</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuToggle}
          className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </header>
  );
};