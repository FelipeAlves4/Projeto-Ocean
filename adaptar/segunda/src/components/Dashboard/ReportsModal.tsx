import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { SimpleReport } from './SimpleReport';
import { ProfessionalReport } from './ProfessionalReport';

interface ReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportsModal = ({ open, onOpenChange }: ReportsModalProps) => {
  const [selectedReport, setSelectedReport] = useState<'selection' | 'simple' | 'professional'>('selection');

  const handleBack = () => {
    setSelectedReport('selection');
  };

  const renderContent = () => {
    switch (selectedReport) {
      case 'simple':
        return <SimpleReport onBack={handleBack} />;
      case 'professional':
        return <ProfessionalReport onBack={handleBack} />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Escolha o Tipo de Relatório</h3>
              <p className="text-sm text-muted-foreground">Selecione o formato que melhor atende suas necessidades</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Relatório Simples */}
              <div 
                className="group p-6 border border-border rounded-lg hover:border-ocean-primary/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedReport('simple')}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-ocean-primary transition-colors">
                      Relatório Simples
                    </h4>
                    <Badge variant="secondary" className="mt-1">Gratuito</Badge>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <span>Resumo de receitas e despesas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <span>Saldo atual e variação mensal</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <span>Gráfico básico de distribuição</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <span>Formato PDF para download</span>
                  </li>
                </ul>
              </div>

              {/* Relatório Profissional */}
              <div 
                className="group p-6 border border-border rounded-lg hover:border-ocean-primary/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedReport('professional')}
              >
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-ocean-primary to-blue-600 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-ocean-primary/20 to-blue-600/20">
                    <BarChart3 className="h-5 w-5 text-ocean-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-ocean-primary transition-colors">
                      Relatório Profissional
                    </h4>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <PieChart className="h-3 w-3 text-ocean-primary" />
                    <span>Demonstrações financeiras completas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-ocean-primary" />
                    <span>Análise de indicadores financeiros</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BarChart3 className="h-3 w-3 text-ocean-primary" />
                    <span>Fluxo de caixa detalhado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-ocean-primary" />
                    <span>Balanço patrimonial e DRE</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-ocean-primary rounded-full" />
                    <span>Insights e recomendações</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-ocean-primary" />
            <span>Relatórios Financeiros</span>
          </DialogTitle>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};