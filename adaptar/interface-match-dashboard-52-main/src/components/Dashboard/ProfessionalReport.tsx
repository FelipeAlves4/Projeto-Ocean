import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ProfessionalReportProps {
  onBack: () => void;
}

// Dados simulados para demonstração
const cashFlowData = [
  { month: 'Jan', operacionais: 5200, investimentos: -1500, financiamentos: 500 },
  { month: 'Fev', operacionais: 5800, investimentos: -800, financiamentos: -200 },
  { month: 'Mar', operacionais: 6200, investimentos: -2100, financiamentos: 300 },
];

const dre = [
  { item: 'Receita Bruta', valor: 10500, tipo: 'receita' },
  { item: '(-) Impostos', valor: -2000, tipo: 'deducao' },
  { item: 'Receita Líquida', valor: 8500, tipo: 'subtotal' },
  { item: '(-) Custos Fixos', valor: -3200, tipo: 'custo' },
  { item: '(-) Custos Variáveis', valor: -1240, tipo: 'custo' },
  { item: 'Lucro Bruto', valor: 4060, tipo: 'subtotal' },
  { item: '(-) Despesas Operacionais', valor: -800, tipo: 'despesa' },
  { item: 'EBITDA', valor: 3260, tipo: 'indicador' },
  { item: '(-) Depreciação', valor: -200, tipo: 'despesa' },
  { item: 'Lucro Líquido', valor: 3060, tipo: 'resultado' },
];

const balancoPatrimonial = {
  ativo: [
    { item: 'Caixa e Equivalentes', valor: 15200 },
    { item: 'Contas a Receber', valor: 8900 },
    { item: 'Estoque', valor: 12300 },
    { item: 'Imobilizado', valor: 45600 },
  ],
  passivo: [
    { item: 'Fornecedores', valor: 6800 },
    { item: 'Impostos a Pagar', valor: 3200 },
    { item: 'Financiamentos', valor: 25400 },
    { item: 'Patrimônio Líquido', valor: 46600 },
  ]
};

const indicadores = [
  { nome: 'Margem Líquida', valor: '36%', status: 'positive', benchmark: '25%' },
  { nome: 'ROI', valor: '24.8%', status: 'positive', benchmark: '15%' },
  { nome: 'Liquidez Corrente', valor: '2.1', status: 'positive', benchmark: '1.5' },
  { nome: 'Endividamento', valor: '45%', status: 'warning', benchmark: '60%' },
  { nome: 'Giro do Ativo', valor: '1.4', status: 'neutral', benchmark: '1.2' },
];

export const ProfessionalReport = ({ onBack }: ProfessionalReportProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleDownload = () => {
    // Simulação do download
    const element = document.createElement('a');
    const file = new Blob(['Relatório Financeiro Profissional - ' + new Date().toLocaleDateString()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'relatorio-profissional.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'negative': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
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
          <span>Baixar Relatório Completo</span>
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Relatório Financeiro Profissional</h2>
        <p className="text-muted-foreground">Análise Completa • Período: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-ocean-primary to-blue-600 text-white">
            Elaborado em {new Date().toLocaleDateString('pt-BR')}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="dre">DRE</TabsTrigger>
          <TabsTrigger value="balance">Balanço</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="analysis">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Indicadores Principais */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Indicadores-Chave de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicadores.map((indicador) => (
                <div key={indicador.nome} className={`p-4 rounded-lg ${getStatusColor(indicador.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{indicador.nome}</span>
                    {getStatusIcon(indicador.status)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{indicador.valor}</div>
                    <div className="text-sm opacity-80">Benchmark: {indicador.benchmark}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gráfico de Evolução */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Evolução Financeira</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="operacionais" stackId="1" stroke="#10b981" fill="#10b981" />
                <Area type="monotone" dataKey="investimentos" stackId="1" stroke="#ef4444" fill="#ef4444" />
                <Area type="monotone" dataKey="financiamentos" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="dre" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Demonstrativo do Resultado do Exercício (DRE)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-right">% da Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dre.map((item, index) => (
                  <TableRow key={index} className={
                    item.tipo === 'resultado' ? 'bg-green-50 dark:bg-green-900/10 font-bold' :
                    item.tipo === 'subtotal' ? 'bg-blue-50 dark:bg-blue-900/10 font-semibold' :
                    item.tipo === 'indicador' ? 'bg-yellow-50 dark:bg-yellow-900/10 font-semibold' : ''
                  }>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell className={`text-right ${item.valor >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.valor >= 0 ? '+' : ''}R$ {item.valor.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {((item.valor / 8500) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Ativo</h3>
              <Table>
                <TableBody>
                  {balancoPatrimonial.ativo.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {item.valor.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-blue-50 dark:bg-blue-900/10 font-bold">
                    <TableCell>Total do Ativo</TableCell>
                    <TableCell className="text-right">
                      R$ {balancoPatrimonial.ativo.reduce((sum, item) => sum + item.valor, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Passivo + Patrimônio Líquido</h3>
              <Table>
                <TableBody>
                  {balancoPatrimonial.passivo.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {item.valor.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50 dark:bg-green-900/10 font-bold">
                    <TableCell>Total do Passivo + PL</TableCell>
                    <TableCell className="text-right">
                      R$ {balancoPatrimonial.passivo.reduce((sum, item) => sum + item.valor, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Demonstrativo do Fluxo de Caixa (DFC)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="operacionais" fill="#10b981" name="Atividades Operacionais" />
                <Bar dataKey="investimentos" fill="#ef4444" name="Atividades de Investimento" />
                <Bar dataKey="financiamentos" fill="#3b82f6" name="Atividades de Financiamento" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center bg-green-50 dark:bg-green-900/10">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Atividades Operacionais</h4>
              <p className="text-2xl font-bold text-green-600">R$ 17.200</p>
              <p className="text-sm text-green-700 dark:text-green-300">Fluxo positivo estável</p>
            </Card>
            <Card className="p-4 text-center bg-red-50 dark:bg-red-900/10">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Atividades de Investimento</h4>
              <p className="text-2xl font-bold text-red-600">-R$ 4.400</p>
              <p className="text-sm text-red-700 dark:text-red-300">Investimentos em expansão</p>
            </Card>
            <Card className="p-4 text-center bg-blue-50 dark:bg-blue-900/10">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Atividades de Financiamento</h4>
              <p className="text-2xl font-bold text-blue-600">R$ 600</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Captação líquida</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Análise e Recomendações Estratégicas</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Pontos Fortes</h4>
                </div>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>• Margem líquida de 36% está acima do benchmark do setor (25%)</li>
                  <li>• ROI de 24.8% demonstra excelente retorno sobre investimento</li>
                  <li>• Liquidez corrente de 2.1 indica boa capacidade de pagamento</li>
                  <li>• Fluxo de caixa operacional consistente e crescente</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Pontos de Atenção</h4>
                </div>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>• Nível de endividamento em 45% próximo ao limite recomendado</li>
                  <li>• Concentração de investimentos pode impactar liquidez</li>
                  <li>• Necessidade de diversificação das fontes de receita</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Recomendações Estratégicas</h4>
                </div>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Manter disciplina financeira atual para preservar margens</li>
                  <li>• Avaliar oportunidades de renegociação de dívidas para reduzir endividamento</li>
                  <li>• Considerar reinvestimento de parte do lucro em diversificação</li>
                  <li>• Estabelecer reserva de emergência equivalente a 6 meses de operação</li>
                  <li>• Implementar controles mais rigorosos de fluxo de caixa</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-ocean-primary/5 to-blue-600/5 border-ocean-primary/20">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-ocean-primary" />
              <span>Projeções para o Próximo Período</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Cenário Conservador</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Crescimento de receita: 8-10%</li>
                  <li>• Margem líquida mantida: 35-36%</li>
                  <li>• ROI projetado: 22-25%</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Cenário Otimista</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Crescimento de receita: 15-18%</li>
                  <li>• Margem líquida: 38-40%</li>
                  <li>• ROI projetado: 28-32%</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground border-t pt-4">
        <p>Relatório elaborado automaticamente pelo sistema de gestão financeira</p>
        <p>Para dúvidas ou esclarecimentos, consulte um profissional contábil</p>
      </div>
    </div>
  );
};