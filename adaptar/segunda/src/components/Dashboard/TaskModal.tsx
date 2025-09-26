import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal = ({ isOpen, onClose, task, onSave, onDelete }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<Task['status']>('pending');
  const { toast } = useToast();

  // Pré-popular campos quando editando
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setTime(task.time);
      setStatus(task.status);
    } else {
      setTitle('');
      setTime('');
      setStatus('pending');
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!time.trim()) {
      toast({
        title: "Erro", 
        description: "O horário da tarefa é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const taskData = {
      title: title.trim(),
      time: time.trim(),
      status
    };

    if (task) {
      onSave({ ...taskData, id: task.id });
    } else {
      onSave(taskData);
    }

    onClose();
    // Resetar campos apenas quando não estiver editando
    if (!task) {
      setTitle('');
      setTime('');
      setStatus('pending');
    }
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  const statusLabels = {
    pending: 'Pendente',
    'in-progress': 'Em Progresso',
    completed: 'Concluída'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Modifique os dados da tarefa abaixo.' : 'Preencha os dados para criar uma nova tarefa.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ex: Hoje, 14:00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            {task && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Excluir Tarefa
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {task ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};