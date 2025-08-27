import { ProjectCard } from '@/components/ProjectCard';
import { ArticleCard } from '@/components/ArticleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FolderOpen, FileText, TrendingUp } from 'lucide-react';

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  imagem_url?: string;
  link_demo?: string;
  link_codigo?: string;
  data_criacao: string;
}

interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
}

interface AdminPreviewProps {
  projects: Projeto[];
  articles: Artigo[];
}

export const AdminPreview = ({ projects, articles }: AdminPreviewProps) => {
  const stats = [
    {
      title: "Total de Projetos",
      value: projects.length,
      icon: FolderOpen,
      color: "text-blue-500"
    },
    {
      title: "Total de Artigos",
      value: articles.length,
      icon: FileText,
      color: "text-green-500"
    },
    {
      title: "Conteúdo Publicado",
      value: projects.length + articles.length,
      icon: TrendingUp,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Eye className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Prévia do Site</h2>
          <p className="text-sm text-muted-foreground">Como os usuários veem seu conteúdo</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card backdrop-blur-xl border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Preview */}
      {projects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Projetos em Destaque</h3>
              <p className="text-sm text-muted-foreground">Como aparecem na seção de projetos</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {projects.length} projeto{projects.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {projects.length > 6 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                E mais {projects.length - 6} projeto{projects.length - 6 !== 1 ? 's' : ''}...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Articles Preview */}
      {articles.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Artigos do Blog</h3>
              <p className="text-sm text-muted-foreground">Como aparecem na seção do blog</p>
            </div>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
              {articles.length} artigo{articles.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>

          {articles.length > 6 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                E mais {articles.length - 6} artigo{articles.length - 6 !== 1 ? 's' : ''}...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && articles.length === 0 && (
        <Card className="glass-card backdrop-blur-xl border-white/20 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum conteúdo publicado</h3>
                <p className="text-muted-foreground">
                  Crie seus primeiros projetos e artigos para ver como aparecerão para os usuários.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};