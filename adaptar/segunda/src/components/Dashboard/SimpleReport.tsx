import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SimpleReportProps {
  onBack: () => void;
}

const financialData = [
  { name: 'Receitas', value: 8500, color: '#10b981' },
  { name: 'Gastos Fixos', value: 3200, color: '#ef4444' },
  { name: 'Investimentos', value: 2100, color: '#3b82f6' },
  { name: 'Cartão de Crédito', value: 1240, color: '#f59e0b' },
];

const monthlyData = [
  { month: 'Jan', receitas: 7200, gastos: 3100 },
  { month: 'Fev', receitas: 7800, gastos: 3150 },
  { month: 'Mar', receitas: 8500, gastos: 3200 },
];

export const SimpleReport = ({ onBack }: SimpleReportProps) => {
  const totalReceitas = 8500;
  const totalGastos = 6540;
  const saldoAtual = totalReceitas - totalGastos;
  const variacao = 12;

  const handleDownload = () => {
    // Simulação do download
    const element = document.createElement('a');
    const file = new Blob(['Relatório Financeiro Simples - ' + new Date().toLocaleDateString()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'relatorio-simples.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <Button onClick={handleDownload} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Baixar PDF</span>
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Relatório Financeiro Simples</h2>
        <p className="text-muted-foreground">Período: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <h3 className="font-semibold text-muted-foreground mb-2">Total de Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totalReceitas.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="font-semibold text-muted-foreground mb-2">Total de Gastos</h3>
          <p className="text-2xl font-bold text-red-500">R$ {totalGastos.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="font-semibold text-muted-foreground mb-2">Saldo Atual</h3>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-2xl font-bold text-ocean-primary">R$ {saldoAtual.toLocaleString()}</p>
            <div className={`flex items-center ${variacao >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {variacao >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-medium">{variacao >= 0 ? '+' : ''}{variacao}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Distribuição */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Distribuição Financeira</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financialData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Barras - Evolução Mensal */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Evolução nos Últimos 3 Meses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
              <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detalhamento Simples */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Resumo Detalhado</h3>
        <div className="space-y-3">
          {financialData.map((item) => (
            <div key={item.name} className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="font-bold" style={{ color: item.color }}>
                R$ {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Observações */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Observações</h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>• Aumento de {variacao}% nas receitas em relação ao mês anterior</li>
          <li>• Gastos fixos mantiveram-se estáveis</li>
          <li>• Recomenda-se manter o ritmo de investimentos atual</li>
        </ul>
      </Card>
    </div>
  );
};