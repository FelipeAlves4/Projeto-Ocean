import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Award, Calendar, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoalModal } from './GoalModal';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  type: string;
}

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Concluir projeto Ocean',
    progress: 75,
    deadline: '15 dias restantes',
    type: 'Projeto'
  },
  {
    id: '2',
    title: 'Economizar R$ 5.000',
    progress: 60,
    deadline: '2 meses restantes',
    type: 'Financeiro'
  },
  {
    id: '3',
    title: 'Ler 12 livros no ano',
    progress: 45,
    deadline: '4 meses restantes',
    type: 'Pessoal'
  }
];

export const GoalsProgress = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const { toast } = useToast();

  const handleAddGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goalData,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Meta criada",
      description: `Nova meta "${newGoal.title}" foi adicionada.`
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
    toast({
      title: "Meta atualizada",
      description: `Meta "${updatedGoal.title}" foi atualizada.`
    });
    setEditingGoal(undefined);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(goal => goal.id === goalId);
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Meta excluída",
      description: `Meta "${goalToDelete?.title}" foi excluída.`
    });
    setEditingGoal(undefined);
  };

  const handleGoalAction = (goal: Goal) => {
    handleEditGoal(goal);
  };

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-ocean-primary" />
          <h3 className="text-lg font-semibold text-foreground">Progresso de Metas</h3>
        </div>
        <Button 
          size="sm" 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-ocean-primary hover:bg-ocean-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div 
            key={goal.id}
            className="group p-4 border border-border rounded-lg hover:bg-accent/5 transition-all duration-200 hover:shadow-md cursor-pointer animate-fade-in relative"
            style={{ animationDelay: `${index * 150}ms` }}
            onClick={() => handleGoalAction(goal)}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground group-hover:text-ocean-primary transition-colors">
                  {goal.title}
                </h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{goal.type}</span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {goal.deadline}
                  </span>
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">{goal.progress}%</span>
                {goal.progress >= 70 && (
                  <Award className="h-4 w-4 text-ocean-success" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGoal(goal);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress 
              value={goal.progress} 
              className="h-2"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button 
          variant="outline"
          className="text-ocean-primary border-ocean-primary hover:bg-ocean-primary hover:text-white transition-all duration-200 hover:scale-105"
        >
          Ver Todas as Metas
        </Button>
      </div>

      <GoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddGoal}
      />

      <GoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGoal(undefined);
        }}
        goal={editingGoal}
        onSave={handleUpdateGoal}
        onDelete={handleDeleteGoal}
      />
    </Card>
  );
};