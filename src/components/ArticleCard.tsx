import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
}

interface ArticleCardProps {
  article: Article;
  index: number;
}

export const ArticleCard = ({ article, index }: ArticleCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de leitura`;
  };

  const handleCardClick = () => {
    navigate('/blog');
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden card-hover glass-card animate-fade-in transition-smooth hover:shadow-elegant h-full"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleCardClick}
    >
      {/* Article Header */}
      <div className="relative bg-gradient-card p-6 border-b border-border/20">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <FileText className="w-3 h-3 mr-1" />
            Artigo
          </Badge>
          <ArrowRight className="w-5 h-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
        </div>

        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {article.titulo}
        </CardTitle>

        {/* Article Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.data_publicacao)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getReadingTime(article.conteudo)}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Article Summary */}
        <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed mb-4 flex-1">
          {article.resumo}
        </p>

        {/* Article Preview */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {article.conteudo.substring(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ler artigo completo
            </span>
            <Badge variant="outline" className="text-xs">
              {article.conteudo.split(' ').length} palavras
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};