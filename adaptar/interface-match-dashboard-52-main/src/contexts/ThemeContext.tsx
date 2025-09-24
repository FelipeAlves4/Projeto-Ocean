import { createContext, useContext, useEffect, useState, useRef } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const createRippleEffect = (event: React.MouseEvent) => {
    if (!rippleRef.current) return;

    const ripple = rippleRef.current;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const size = Math.max(window.innerWidth, window.innerHeight) * 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    ripple.classList.remove('animate-theme-ripple');
    void ripple.offsetWidth; // Force reflow
    ripple.classList.add('animate-theme-ripple');
  };

  const toggleTheme = (event?: React.MouseEvent) => {
    if (event) {
      createRippleEffect(event);
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      setTimeout(() => setIsTransitioning(false), 300);
    }, 100);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      <div className="relative">
        {children}
        <div
          ref={rippleRef}
          className="fixed pointer-events-none z-[9999] bg-ocean-primary rounded-full"
          style={{ transform: 'scale(0)' }}
        />
      </div>
    </ThemeContext.Provider>
  );
};