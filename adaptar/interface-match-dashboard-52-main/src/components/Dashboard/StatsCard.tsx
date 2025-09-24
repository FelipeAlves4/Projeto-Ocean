import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  progress?: number;
}

export const StatsCard = ({ title, value, subtitle, icon: Icon, progress }: StatsCardProps) => {
  const { toast } = useToast();

  const handleCardClick = () => {
    toast({
      title: `${title} selecionado`,
      description: `Visualizando detalhes de: ${title}`
    });
  };

  return (
    <Card 
      className="p-6 bg-card border-border hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group animate-scale-in"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-ocean-primary transition-all duration-200 group-hover:scale-110" />
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-ocean-primary h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};