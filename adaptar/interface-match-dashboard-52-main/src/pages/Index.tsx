import { CheckCircle, Clock, Target, DollarSign } from 'lucide-react';
import { Header } from '@/components/Dashboard/Header';
import { Sidebar } from '@/components/Dashboard/Sidebar';

import { StatsCard } from '@/components/Dashboard/StatsCard';
import { RecentTasks } from '@/components/Dashboard/RecentTasks';
import { GoalsProgress } from '@/components/Dashboard/GoalsProgress';
import { FinancialOverview } from '@/components/Dashboard/FinancialOverview';
import { TabNavigation } from '@/components/Dashboard/TabNavigation';
import { ProductsManager } from '@/components/Dashboard/ProductsManager';
import { SettingsPage } from '@/components/Dashboard/SettingsPage';
import { Help } from '@/components/Dashboard/Help';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';

const DashboardContent = () => {
  const { activeSection, sidebarOpen, toggleSidebar } = useNavigation();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'progress':
        return <GoalsProgress />;
      case 'financial':
        return <FinancialOverview />;
      case 'products':
        return <ProductsManager />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <Help />;
      case 'recent':
      default:
        return <RecentTasks />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header onMenuToggle={toggleSidebar} />
      
      <main className="px-6 py-8 transition-all duration-300">
        {activeSection !== 'settings' && activeSection !== 'help' && (
          <div className="mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">Bem-vindo</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Controle suas tarefas, metas e finanças em um só lugar.</p>
          </div>
        )}

        {activeSection !== 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
              <StatsCard
                title="Tarefas Concluídas"
                value="12/20"
                subtitle="+2 concluídas desde ontem"
                icon={CheckCircle}
                progress={60}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
              <StatsCard
                title="Tempo Produtivo"
                value="5.2h"
                subtitle="+1.2h em relação à média"
                icon={Clock}
                progress={75}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <StatsCard
                title="Metas Ativas"
                value="4"
                subtitle="3 em progresso, 1 atrasada"
                icon={Target}
                progress={45}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '400ms' }}>
              <StatsCard
                title="Balanço Financeiro"
                value="R$ 2.840"
                subtitle="+12% em relação ao mês passado"
                icon={DollarSign}
                progress={85}
              />
            </div>
          </div>
        )}

        {(activeSection === 'recent' || activeSection === 'progress' || activeSection === 'financial' || activeSection === 'products') && (
          <div className="mb-6" style={{ animationDelay: '500ms' }}>
            <TabNavigation />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6" style={{ animationDelay: '600ms' }}>
          {renderActiveSection()}
        </div>
      </main>

      <Sidebar isOpen={sidebarOpen} />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <NavigationProvider>
      <DashboardContent />
    </NavigationProvider>
  );
};

export default Index;
