import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Artigo {
  id: string;
  titulo: string;
  ordem_exibicao?: number;
}

interface ArticleOrderingControlsProps {
  articles: Artigo[];
  onReorder: () => void;
}

export const ArticleOrderingControls = ({ articles, onReorder }: ArticleOrderingControlsProps) => {
  const moveArticle = async (articleId: string, direction: 'up' | 'down') => {
    const currentIndex = articles.findIndex(a => a.id === articleId);
    if (currentIndex === -1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= articles.length) return;

    const currentArticle = articles[currentIndex];
    const swapArticle = articles[swapIndex];

    // Update ordem_exibicao values
    const newCurrentOrder = swapArticle.ordem_exibicao || 0;
    const newSwapOrder = currentArticle.ordem_exibicao || 0;

    try {
      const { error: error1 } = await supabase
        .from('artigos')
        .update({ ordem_exibicao: newCurrentOrder })
        .eq('id', currentArticle.id);

      const { error: error2 } = await supabase
        .from('artigos')
        .update({ ordem_exibicao: newSwapOrder })
        .eq('id', swapArticle.id);

      if (error1 || error2) {
        throw new Error('Erro ao reordenar artigos');
      }

      toast({ title: 'Sucesso', description: 'Ordem dos artigos atualizada!' });
      onReorder();
    } catch (error) {
      console.error('Erro ao reordenar artigos:', error);
      toast({ title: 'Erro', description: 'Erro ao reordenar artigos', variant: 'destructive' });
    }
  };

  const resetOrder = async () => {
    if (!confirm('Tem certeza que deseja resetar a ordem dos artigos?')) return;

    try {
      // Set ordem_exibicao based on current order (index)
      const updates = articles.map((article, index) => 
        supabase
          .from('artigos')
          .update({ ordem_exibicao: articles.length - index })
          .eq('id', article.id)
      );

      await Promise.all(updates);

      toast({ title: 'Sucesso', description: 'Ordem dos artigos resetada!' });
      onReorder();
    } catch (error) {
      console.error('Erro ao resetar ordem:', error);
      toast({ title: 'Erro', description: 'Erro ao resetar ordem', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reordenar Artigos</h3>
        <Button onClick={resetOrder} variant="outline" size="sm">
          Resetar Ordem
        </Button>
      </div>
      
      <div className="space-y-2">
        {articles.map((article, index) => (
          <div 
            key={article.id} 
            className="flex items-center justify-between p-3 glass-card backdrop-blur-sm border-white/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                #{index + 1}
              </span>
              <span className="font-medium">{article.titulo}</span>
            </div>
            
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveArticle(article.id, 'up')}
                disabled={index === 0}
                className="hover:bg-primary/10"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveArticle(article.id, 'down')}
                disabled={index === articles.length - 1}
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