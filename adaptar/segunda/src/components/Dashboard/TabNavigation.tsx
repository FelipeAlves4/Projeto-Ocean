import { Button } from '@/components/ui/button';
import { List, TrendingUp, CreditCard, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';

const tabs = [
  { id: 'recent' as const, label: 'Tarefas Recentes', icon: List },
  { id: 'progress' as const, label: 'Progresso de Metas', icon: TrendingUp },
  { id: 'financial' as const, label: 'Visão Financeira', icon: CreditCard },
  { id: 'products' as const, label: 'Produtos', icon: Package },
];

export const TabNavigation = () => {
  const { activeSection, setActiveSection } = useNavigation();

  return (
    <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit animate-fade-in">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeSection === tab.id ? "default" : "ghost"}
          size="sm"
          className={cn(
            "flex items-center space-x-2 transition-all duration-200 hover:scale-105",
            activeSection === tab.id 
              ? "bg-ocean-primary text-white hover:bg-ocean-primary/90 shadow-lg scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          onClick={() => setActiveSection(tab.id)}
        >
          <tab.icon className="h-4 w-4" />
          <span>{tab.label}</span>
        </Button>
      ))}
    </div>
  );
};