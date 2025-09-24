import { useState, useEffect } from 'react';
import { Monitor, Moon, Sun, Bell, Shield, Database, Palette, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  notifications: boolean;
  autoSave: boolean;
  dataBackup: boolean;
  analytics: boolean;
}

export const SettingsPage = () => {
  const { toast } = useToast();
  const { theme: currentTheme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'pt-BR',
    notifications: true,
    autoSave: true,
    dataBackup: false,
    analytics: true
  });

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Sincronizar tema atual com as configurações
  useEffect(() => {
    setSettings(prev => ({ ...prev, theme: currentTheme === 'light' ? 'light' : 'dark' }));
  }, [currentTheme]);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Salvar automaticamente no localStorage
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // Aplicar mudanças específicas
    if (key === 'theme') {
      if ((value === 'dark' && currentTheme !== 'dark') || 
          (value === 'light' && currentTheme !== 'light')) {
        toggleTheme();
      }
    }
    
    if (key === 'language') {
      toast({
        title: "Idioma alterado",
        description: `Interface alterada para ${value === 'pt-BR' ? 'Português' : 'English'}`
      });
    }
    
    // Feedback visual para outras alterações
    if (key === 'notifications') {
      toast({
        title: value ? "Notificações ativadas" : "Notificações desativadas",
        description: value ? "Você receberá notificações em tempo real" : "Notificações foram desabilitadas"
      });
    }
  };

  const handleSaveSettings = () => {
    // Salvar no localStorage (já é feito automaticamente)
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso!"
    });
    
    // Aplicar configurações de notificação
    if (settings.notifications && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notificações habilitadas');
        }
      });
    }
  };

  const getThemeDisplayValue = () => {
    return settings.theme || (currentTheme === 'light' ? 'light' : 'dark');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência e gerencie suas preferências</p>
      </div>

      <div className="space-y-12">
        {/* Aparência */}
        <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2 mb-2">
              <Palette className="h-5 w-5 text-ocean-primary" />
              <span>Aparência</span>
            </h2>
            <p className="text-muted-foreground">
              Configure o tema e a aparência da aplicação
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha o tema da interface
                </p>
              </div>
              <Select value={getThemeDisplayValue()} onValueChange={(value) => handleSettingChange('theme', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Claro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Escuro</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language">Idioma</Label>
                <p className="text-sm text-muted-foreground">
                  Selecione o idioma da interface
                </p>
              </div>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Português</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en-US">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>English</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2 mb-2">
              <Bell className="h-5 w-5 text-ocean-primary" />
              <span>Notificações</span>
            </h2>
            <p className="text-muted-foreground">
              Configure como você recebe notificações
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações em tempo real
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-ocean-primary" />
              <span>Sistema</span>
            </h2>
            <p className="text-muted-foreground">
              Configure opções do sistema e backup
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Salvamento Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Salva automaticamente suas alterações
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dataBackup">Backup Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Faz backup dos seus dados regularmente
                </p>
              </div>
              <Switch
                id="dataBackup"
                checked={settings.dataBackup}
                onCheckedChange={(checked) => handleSettingChange('dataBackup', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir coleta de dados para melhorar o serviço
                </p>
              </div>
              <Switch
                id="analytics"
                checked={settings.analytics}
                onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
              />
            </div>
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="flex justify-start animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button 
            onClick={handleSaveSettings}
            className="bg-ocean-primary hover:bg-ocean-primary/90 hover:shadow-lg hover:shadow-ocean-primary/25 transition-all duration-300 hover:scale-105"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};