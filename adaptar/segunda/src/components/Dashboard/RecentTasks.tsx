import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaskModal } from './TaskModal';

interface Task {
  id: string;
  title: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Reunião de planejamento',
    time: 'Hoje, 14:00',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Entrega do relatório trimestral',
    time: 'Amanhã, 18:00',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Atualizar documentação',
    time: 'Ontem, 16:30',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Revisão do orçamento',
    time: 'Sexta, 10:00',
    status: 'pending'
  }
];

const getStatusBadge = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-ocean-success text-white hover:bg-ocean-success/90">Concluída</Badge>;
    case 'in-progress':
      return <Badge variant="default" className="bg-ocean-warning text-white hover:bg-ocean-warning/90">Em progresso</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-ocean-info text-white hover:bg-ocean-info/90">Pendente</Badge>;
  }
};

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-ocean-success" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-ocean-warning" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-ocean-info" />;
  }
};

export const RecentTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();

  const handleStatusChange = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        let newStatus: Task['status'];
        switch (task.status) {
          case 'pending':
            newStatus = 'in-progress';
            break;
          case 'in-progress':
            newStatus = 'completed';
            break;
          case 'completed':
            newStatus = 'pending';
            break;
        }
        
        toast({
          title: "Status atualizado",
          description: `Tarefa "${task.title}" marcada como ${newStatus === 'completed' ? 'concluída' : newStatus === 'in-progress' ? 'em progresso' : 'pendente'}.`
        });
        
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Tarefa criada",
      description: `Nova tarefa "${newTask.title}" foi adicionada.`
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    toast({
      title: "Tarefa atualizada",
      description: `Tarefa "${updatedTask.title}" foi atualizada.`
    });
    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tarefa excluída",
      description: `Tarefa "${taskToDelete?.title}" foi excluída.`
    });
    setEditingTask(undefined);
  };

  const handleViewAll = () => {
    toast({
      title: "Navegando para tarefas",
      description: "Redirecionando para a página completa de tarefas..."
    });
  };

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tarefas Recentes</h3>
          <p className="text-sm text-muted-foreground">Visualize e gerencie suas tarefas pendentes e concluídas.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-ocean-primary hover:bg-ocean-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className="group flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleStatusChange(task.id)}
                className="transition-transform duration-200 hover:scale-110"
              >
                {getStatusIcon(task.status)}
              </button>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-ocean-primary transition-colors">{task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.time}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={() => handleStatusChange(task.id)}>
                {getStatusBadge(task.status)}
              </button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleEditTask(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button 
          variant="outline" 
          onClick={handleViewAll}
          className="text-ocean-primary border-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200 hover:scale-105"
        >
          Ver Todos
        </Button>
      </div>

      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(undefined);
        }}
        task={editingTask}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </Card>
  );
};