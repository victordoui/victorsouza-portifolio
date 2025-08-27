import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProjectRecommendations from '@/components/ProjectRecommendations';

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[] | null;
  imagem_url: string | null;
  link_demo: string | null;
  link_codigo: string | null;
  data_criacao: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar projeto:', error);
        navigate('/');
        return;
      }

      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 group hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Voltar aos Projetos
          </Button>
          
          <nav className="text-sm text-muted-foreground">
            <span>Início</span>
            <span className="mx-2">/</span>
            <span>Projetos</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{project.titulo}</span>
          </nav>
        </div>

        {/* Project Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Project Image */}
          <div className="space-y-6">
            <Card className="overflow-hidden card-hover">
              <div className="aspect-video relative">
                {project.imagem_url ? (
                  <img
                    src={project.imagem_url}
                    alt={project.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                    <Globe className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              {project.link_demo && (
                <Button asChild className="flex-1 btn-modern">
                  <a href={project.link_demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Demo
                  </a>
                </Button>
              )}
              {project.link_codigo && (
                <Button variant="outline" asChild className="flex-1 btn-outline-modern">
                  <a href={project.link_codigo} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 hero-gradient-text">
                {project.titulo}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(project.data_criacao)}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.descricao}
              </p>
            </div>

            {/* Technologies */}
            {project.tecnologias && project.tecnologias.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tecnologias Utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tecnologias.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 transition-smooth hover:bg-accent">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Project Details */}
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Detalhes do Projeto</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Concluído</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">Projeto Pessoal</span>
                </div>
                {project.tecnologias && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stack Principal:</span>
                    <span className="font-medium">{project.tecnologias[0]}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Project Recommendations */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Projetos Relacionados</h2>
          <ProjectRecommendations currentProject={project} maxRecommendations={3} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;