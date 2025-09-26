import { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Video, 
  Mail, 
  Phone,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Bug,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const Help = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string>('');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Como adicionar uma nova tarefa?',
      answer: 'Clique no botão "Nova Tarefa" na aba de tarefas ou use o botão "Adicionar" no menu lateral. Preencha o nome, descrição e defina o status da tarefa.',
      category: 'tarefas'
    },
    {
      id: '2',
      question: 'Como editar uma meta existente?',
      answer: 'Passe o mouse sobre a meta desejada e clique no botão "Editar" que aparecerá. Você pode alterar o tipo, progresso, valor alvo e outras configurações.',
      category: 'metas'
    },
    {
      id: '3',
      question: 'Como exportar meus dados?',
      answer: 'Vá para Configurações > Exportação de Dados e escolha o formato desejado (PDF, Excel, CSV ou JSON). Clique em "Exportar Relatório" ou "Exportar Dados".',
      category: 'dados'
    },
    {
      id: '4',
      question: 'Como alterar o tema do dashboard?',
      answer: 'Use o botão de alternância de tema no canto superior direito ou vá para Configurações > Tema e Aparência para personalizar a interface.',
      category: 'configurações'
    },
    {
      id: '5',
      question: 'Como ativar notificações?',
      answer: 'Acesse Configurações > Notificações e ative as opções de notificação por e-mail ou push conforme sua preferência.',
      category: 'notificações'
    },
    {
      id: '6',
      question: 'O dashboard funciona offline?',
      answer: 'O dashboard requer conexão com a internet para sincronizar dados. Algumas funcionalidades básicas podem funcionar offline temporariamente.',
      category: 'técnico'
    },
    {
      id: '7',
      question: 'Como resetar minhas configurações?',
      answer: 'Vá para Configurações e clique em "Restaurar Padrões" para voltar às configurações originais do sistema.',
      category: 'configurações'
    },
    {
      id: '8',
      question: 'Posso conectar com outros aplicativos?',
      answer: 'Sim, vá para Configurações > Integrações Externas e ative a sincronização automática para conectar com serviços externos.',
      category: 'integrações'
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSupport = (type: string) => {
    toast({
      title: `Contato via ${type}`,
      description: `Redirecionando para o canal de suporte via ${type}...`
    });
  };

  const handleTutorialAccess = (tutorial: string) => {
    toast({
      title: `Acessando tutorial`,
      description: `Abrindo tutorial: ${tutorial}...`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Central de Ajuda</h2>
        <p className="text-muted-foreground">Encontre respostas e suporte para usar o dashboard</p>
      </div>

      {/* Busca */}
      <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por ajuda, tutoriais ou FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-ocean-primary" />
            Começar Rapidamente
          </CardTitle>
          <CardDescription>
            Acesso rápido aos recursos mais importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleTutorialAccess('Tour do Dashboard')}
            >
              <BookOpen className="h-6 w-6 text-ocean-primary" />
              <span className="text-sm">Tour do Dashboard</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleTutorialAccess('Gerenciar Tarefas')}
            >
              <FileText className="h-6 w-6 text-ocean-primary" />
              <span className="text-sm">Gerenciar Tarefas</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleTutorialAccess('Definir Metas')}
            >
              <Lightbulb className="h-6 w-6 text-ocean-primary" />
              <span className="text-sm">Definir Metas</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleTutorialAccess('Relatórios Financeiros')}
            >
              <Video className="h-6 w-6 text-ocean-primary" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-ocean-primary" />
            Perguntas Frequentes
          </CardTitle>
          <CardDescription>
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'pergunta encontrada' : 'perguntas encontradas'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredFAQs.map((faq) => (
            <Collapsible
              key={faq.id}
              open={openFAQ === faq.id}
              onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? '' : faq.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left p-4 h-auto"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="font-medium">{faq.question}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                  {openFAQ === faq.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma pergunta encontrada para "{searchTerm}"
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutoriais em Vídeo */}
      <Card className="animate-scale-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-ocean-primary" />
            Tutoriais em Vídeo
          </CardTitle>
          <CardDescription>
            Aprenda a usar todas as funcionalidades do dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Introdução ao Dashboard', duration: '5:30', level: 'Iniciante' },
              { title: 'Gerenciamento de Tarefas', duration: '8:15', level: 'Intermediário' },
              { title: 'Configuração de Metas', duration: '6:45', level: 'Iniciante' },
              { title: 'Relatórios Avançados', duration: '12:20', level: 'Avançado' }
            ].map((video, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => handleTutorialAccess(video.title)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-ocean-primary/10 p-2 rounded">
                    <Video className="h-4 w-4 text-ocean-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {video.duration} • {video.level}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suporte */}
      <Card className="animate-scale-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-ocean-primary" />
            Suporte e Contato
          </CardTitle>
          <CardDescription>
            Precisa de ajuda personalizada? Entre em contato conosco
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleContactSupport('Chat')}
            >
              <MessageCircle className="h-6 w-6 text-ocean-primary" />
              <div className="text-center">
                <p className="font-medium">Chat Online</p>
                <p className="text-sm text-muted-foreground">Resposta imediata</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleContactSupport('E-mail')}
            >
              <Mail className="h-6 w-6 text-ocean-primary" />
              <div className="text-center">
                <p className="font-medium">E-mail</p>
                <p className="text-sm text-muted-foreground">24h para resposta</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleContactSupport('Telefone')}
            >
              <Phone className="h-6 w-6 text-ocean-primary" />
              <div className="text-center">
                <p className="font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">Seg-Sex 9h-18h</p>
              </div>
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reportar um problema</p>
              <p className="text-sm text-muted-foreground">
                Encontrou um bug ou erro no sistema?
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleContactSupport('Bug Report')}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Reportar Bug
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recursos Adicionais */}
      <Card className="animate-scale-in" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-ocean-primary" />
            Recursos Adicionais
          </CardTitle>
          <CardDescription>
            Links úteis e recursos externos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="ghost"
              className="justify-start h-auto p-3"
              onClick={() => handleTutorialAccess('Documentação')}
            >
              <FileText className="h-4 w-4 mr-3 text-ocean-primary" />
              <div className="text-left">
                <p className="font-medium">Documentação Completa</p>
                <p className="text-sm text-muted-foreground">Guias detalhados</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start h-auto p-3"
              onClick={() => handleTutorialAccess('Comunidade')}
            >
              <MessageCircle className="h-4 w-4 mr-3 text-ocean-primary" />
              <div className="text-left">
                <p className="font-medium">Comunidade</p>
                <p className="text-sm text-muted-foreground">Fórum de usuários</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start h-auto p-3"
              onClick={() => handleTutorialAccess('Blog')}
            >
              <BookOpen className="h-4 w-4 mr-3 text-ocean-primary" />
              <div className="text-left">
                <p className="font-medium">Blog</p>
                <p className="text-sm text-muted-foreground">Dicas e novidades</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start h-auto p-3"
              onClick={() => handleTutorialAccess('Atualizações')}
            >
              <Globe className="h-4 w-4 mr-3 text-ocean-primary" />
              <div className="text-left">
                <p className="font-medium">Atualizações</p>
                <p className="text-sm text-muted-foreground">Novas funcionalidades</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};