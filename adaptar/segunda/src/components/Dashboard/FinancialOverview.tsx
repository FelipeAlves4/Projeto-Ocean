import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportsModal } from './ReportsModal';

const financialData = [
  {
    id: '1',
    title: 'Receitas do Mês',
    amount: 'R$ 8.500',
    change: '+15%',
    type: 'income',
    icon: TrendingUp
  },
  {
    id: '2', 
    title: 'Gastos Fixos',
    amount: 'R$ 3.200',
    change: '+2%',
    type: 'expense',
    icon: Receipt
  },
  {
    id: '3',
    title: 'Investimentos',
    amount: 'R$ 2.100',
    change: '+8%',
    type: 'investment',
    icon: PiggyBank
  },
  {
    id: '4',
    title: 'Cartão de Crédito',
    amount: 'R$ 1.240',
    change: '-5%',
    type: 'credit',
    icon: CreditCard
  }
];

export const FinancialOverview = () => {
  const { toast } = useToast();
  const [reportsModalOpen, setReportsModalOpen] = useState(false);

  const handleFinancialAction = (title: string) => {
    toast({
      title: "Categoria financeira",
      description: `Visualizando detalhes de: "${title}"`
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-ocean-success';
      case 'expense':
        return 'text-red-500';
      case 'investment':
        return 'text-ocean-primary';
      case 'credit':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-ocean-success' : 'text-red-500';
  };

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-ocean-primary" />
          <h3 className="text-lg font-semibold text-foreground">Visão Financeira</h3>
        </div>
        <Button 
          size="sm" 
          className="bg-ocean-primary hover:bg-ocean-primary/90"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {financialData.map((item, index) => (
          <div
            key={item.id}
            className="group p-4 border border-border rounded-lg hover:bg-accent/5 transition-all duration-200 hover:shadow-md cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleFinancialAction(item.title)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-muted ${getTypeColor(item.type)}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-ocean-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-lg font-bold text-foreground">{item.amount}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Saldo Total</span>
          <span className="text-2xl font-bold text-ocean-success">R$ 6.840</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Variação mensal</span>
          <span className="text-sm font-medium text-ocean-success flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12%
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button 
          variant="outline"
          className="text-ocean-primary border-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200 hover:scale-105"
          onClick={() => setReportsModalOpen(true)}
        >
          Ver Relatório Completo
        </Button>
      </div>
      
      <ReportsModal 
        open={reportsModalOpen} 
        onOpenChange={setReportsModalOpen} 
      />
    </Card>
  );
};