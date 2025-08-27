import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, ArrowRight, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  imagem_url?: string;
  link_demo?: string;
  link_codigo?: string;
  data_criacao: string;
  title_align?: string;
  description_align?: string;
  image_fit?: string;
  image_focal_x?: number;
  image_focal_y?: number;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  // Helper para gerar URL pública das imagens do storage
  const getImageUrl = (imagemUrl?: string) => {
    if (!imagemUrl) return null;
    
    // Se já é uma URL completa, usa como está
    if (imagemUrl.startsWith('http')) {
      return imagemUrl;
    }
    
    // Se é apenas o nome do arquivo, gera a URL pública do storage
    const { data } = supabase.storage
      .from('projeto-images')
      .getPublicUrl(imagemUrl);
    
    return data.publicUrl;
  };

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden card-hover glass-card animate-fade-in transition-smooth hover:shadow-elegant gpu"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleCardClick}
    >
      {/* Project Image */}
      <div className="aspect-video relative overflow-hidden image-fade-border">
        {project.imagem_url ? (
          <img
            src={getImageUrl(project.imagem_url) || ''}
            alt={project.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback icon quando não há imagem ou erro no carregamento */}
        <div className={`fallback-icon w-full h-full bg-gradient-card flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-accent ${project.imagem_url ? 'hidden' : ''}`}>
          <Globe className="w-12 h-12 text-muted-foreground transition-all duration-500 group-hover:text-foreground group-hover:scale-110" />
        </div>
        
        {/* Overlay with action buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3">
          {project.link_demo && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 text-black hover:bg-white transition-smooth"
              onClick={(e) => handleButtonClick(e, () => window.open(project.link_demo!, '_blank'))}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Demo
            </Button>
          )}
          {project.link_codigo && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/50 text-white hover:bg-white/10 transition-smooth"
              onClick={(e) => handleButtonClick(e, () => window.open(project.link_codigo!, '_blank'))}
            >
              <Github className="w-4 h-4 mr-1" />
              Código
            </Button>
          )}
        </div>

        {/* Date badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/60 text-white border-none">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(project.data_criacao)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Project Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {project.titulo}
          </h3>
          <ArrowRight className="w-5 h-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 flex-shrink-0 mt-1" />
        </div>

        {/* Project Description */}
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {project.descricao}
        </p>

        {/* Technologies */}
        {project.tecnologias && project.tecnologias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tecnologias.slice(0, 4).map((tech, techIndex) => (
              <Badge 
                key={techIndex} 
                variant="outline" 
                className="text-xs px-2 py-1 transition-smooth hover:bg-accent hover:border-accent-foreground"
              >
                {tech}
              </Badge>
            ))}
            {project.tecnologias.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                +{project.tecnologias.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Ver detalhes
          </span>
          <div className="flex gap-2">
            {project.link_demo && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent transition-smooth"
                onClick={(e) => handleButtonClick(e, () => window.open(project.link_demo!, '_blank'))}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {project.link_codigo && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent transition-smooth"
                onClick={(e) => handleButtonClick(e, () => window.open(project.link_codigo!, '_blank'))}
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};