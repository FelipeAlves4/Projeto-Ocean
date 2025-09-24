import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  type: string;
}

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal;
  onSave: (goal: Omit<Goal, 'id'> | Goal) => void;
  onDelete?: (goalId: string) => void;
}

export const GoalModal = ({ isOpen, onClose, goal, onSave, onDelete }: GoalModalProps) => {
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [type, setType] = useState('');
  const { toast } = useToast();

  // Pré-popular campos quando editando
  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setProgress(goal.progress);
      setDeadline(goal.deadline);
      setType(goal.type);
    } else {
      setTitle('');
      setProgress(0);
      setDeadline('');
      setType('');
    }
  }, [goal, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da meta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!deadline.trim()) {
      toast({
        title: "Erro",
        description: "O prazo da meta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!type) {
      toast({
        title: "Erro",
        description: "O tipo da meta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const goalData = {
      title: title.trim(),
      progress,
      deadline: deadline.trim(),
      type
    };

    if (goal) {
      onSave({ ...goalData, id: goal.id });
    } else {
      onSave(goalData);
    }

    onClose();
    // Resetar campos apenas quando não estiver editando
    if (!goal) {
      setTitle('');
      setProgress(0);
      setDeadline('');
      setType('');
    }
  };

  const handleDelete = () => {
    if (goal && onDelete) {
      onDelete(goal.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </DialogTitle>
          <DialogDescription>
            {goal ? 'Modifique os dados da meta abaixo.' : 'Preencha os dados para criar uma nova meta.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da meta"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Projeto">Projeto</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Pessoal">Pessoal</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo</Label>
            <Input
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Ex: 15 dias restantes"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="progress">Progresso: {progress}%</Label>
            <Slider
              id="progress"
              min={0}
              max={100}
              step={5}
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            {goal && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Excluir Meta
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {goal ? 'Salvar' : 'Criar Meta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};