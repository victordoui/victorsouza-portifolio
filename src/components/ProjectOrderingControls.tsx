import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Projeto {
  id: string;
  titulo: string;
  ordem_exibicao?: number;
}

interface ProjectOrderingControlsProps {
  projects: Projeto[];
  onReorder: () => void;
}

export const ProjectOrderingControls = ({ projects, onReorder }: ProjectOrderingControlsProps) => {
  const moveProject = async (projectId: string, direction: 'up' | 'down') => {
    const currentIndex = projects.findIndex(p => p.id === projectId);
    if (currentIndex === -1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= projects.length) return;

    const currentProject = projects[currentIndex];
    const swapProject = projects[swapIndex];

    // Update ordem_exibicao values
    const newCurrentOrder = swapProject.ordem_exibicao || 0;
    const newSwapOrder = currentProject.ordem_exibicao || 0;

    try {
      const { error: error1 } = await supabase
        .from('projetos')
        .update({ ordem_exibicao: newCurrentOrder })
        .eq('id', currentProject.id);

      const { error: error2 } = await supabase
        .from('projetos')
        .update({ ordem_exibicao: newSwapOrder })
        .eq('id', swapProject.id);

      if (error1 || error2) {
        throw new Error('Erro ao reordenar projetos');
      }

      toast({ title: 'Sucesso', description: 'Ordem dos projetos atualizada!' });
      onReorder();
    } catch (error) {
      console.error('Erro ao reordenar projetos:', error);
      toast({ title: 'Erro', description: 'Erro ao reordenar projetos', variant: 'destructive' });
    }
  };

  const resetOrder = async () => {
    if (!confirm('Tem certeza que deseja resetar a ordem dos projetos?')) return;

    try {
      // Set ordem_exibicao based on current order (index)
      const updates = projects.map((project, index) => 
        supabase
          .from('projetos')
          .update({ ordem_exibicao: projects.length - index })
          .eq('id', project.id)
      );

      await Promise.all(updates);

      toast({ title: 'Sucesso', description: 'Ordem dos projetos resetada!' });
      onReorder();
    } catch (error) {
      console.error('Erro ao resetar ordem:', error);
      toast({ title: 'Erro', description: 'Erro ao resetar ordem', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reordenar Projetos</h3>
        <Button onClick={resetOrder} variant="outline" size="sm">
          Resetar Ordem
        </Button>
      </div>
      
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="flex items-center justify-between p-3 glass-card backdrop-blur-sm border-white/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                #{index + 1}
              </span>
              <span className="font-medium">{project.titulo}</span>
            </div>
            
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveProject(project.id, 'up')}
                disabled={index === 0}
                className="hover:bg-primary/10"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveProject(project.id, 'down')}
                disabled={index === projects.length - 1}
                className="hover:bg-primary/10"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};