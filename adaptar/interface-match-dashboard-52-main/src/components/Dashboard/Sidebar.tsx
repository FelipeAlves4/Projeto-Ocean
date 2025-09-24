import { 
  LayoutDashboard, 
  CheckSquare, 
  Target, 
  DollarSign, 
  Settings, 
  User, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'recent' as const },
  { icon: CheckSquare, label: 'Tarefas', section: 'recent' as const },
  { icon: Target, label: 'Metas', section: 'progress' as const },
  { icon: DollarSign, label: 'Finanças', section: 'financial' as const },
  { icon: Settings, label: 'Configurações', section: 'settings' as const },
  { icon: User, label: 'Perfil', section: null },
  { icon: HelpCircle, label: 'Ajuda', section: 'help' as const },
];

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const { activeSection, setActiveSection, setSidebarOpen, openAddProductModal } = useNavigation();
  const { toast } = useToast();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.section) {
      setActiveSection(item.section);
      setSidebarOpen(false);
    } else {
      toast({
        title: `${item.label} selecionado`,
        description: `Navegando para ${item.label.toLowerCase()}...`
      });
    }
  };

  const handleAddClick = () => {
    openAddProductModal();
    toast({
      title: "Adicionar produto",
      description: "Abrindo formulário para adicionar novo produto..."
    });
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 h-full bg-card border-l border-border transform transition-all duration-300 ease-in-out z-50",
      isOpen ? "translate-x-0 animate-slide-in-right" : "translate-x-full",
      "w-72"
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo</p>
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground">Controle suas tarefas, metas e finanças em um só lugar.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Button 
            size="sm" 
            className="bg-ocean-primary hover:bg-ocean-primary/90 text-white transition-all duration-200 hover:scale-105"
          >
            📅 Hoje
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-ocean-primary text-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200 hover:scale-105"
            onClick={handleAddClick}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              variant={activeSection === item.section && item.section ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-10 transition-all duration-200 hover:scale-105 animate-fade-in",
                activeSection === item.section && item.section
                  ? "bg-ocean-primary text-white hover:bg-ocean-primary/90 shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              style={{ animationDelay: `${(index + 2) * 50}ms` }}
              onClick={() => handleMenuClick(item)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};