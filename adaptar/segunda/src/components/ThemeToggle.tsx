import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full bg-muted hover:bg-accent transition-all duration-200 hover:scale-105 relative overflow-hidden"
      disabled={isTransitioning}
    >
      <div className={`transition-all duration-300 ${isTransitioning ? 'animate-bounce-soft' : ''}`}>
        {theme === 'light' ? (
          <Moon className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};