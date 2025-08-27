import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { getProjectRecommendations, ProjectRecommendation } from '@/utils/intelligentRecommendations';
import { supabase } from '@/integrations/supabase/client';

interface ProjectRecommendationsProps {
  currentProject: any;
  maxRecommendations?: number;
}

const ProjectRecommendations: React.FC<ProjectRecommendationsProps> = ({ 
  currentProject, 
  maxRecommendations = 3 
}) => {
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os projetos
        const { data: allProjects, error } = await supabase
          .from('projetos')
          .select('*')
          .order('data_criacao', { ascending: false });

        if (error) {
          console.error('Erro ao buscar projetos:', error);
          return;
        }

        if (allProjects && currentProject) {
          const recs = getProjectRecommendations(
            currentProject, 
            allProjects, 
            maxRecommendations
          );
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProject) {
      loadRecommendations();
    }
  }, [currentProject, maxRecommendations]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Projetos Relacionados</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projetos Relacionados</h3>
        <p className="text-sm text-muted-foreground">
          Baseado em tecnologias similares
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-md transition-all duration-300 group">
            {rec.imagem_url && (
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={rec.imagem_url}
                  alt={rec.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <CardHeader className="pb-3">
              <CardTitle className="text-base line-clamp-1">{rec.titulo}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {rec.descricao}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Indicador de similaridade */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${rec.similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(rec.similarity * 100)}% similar
                  </span>
                </div>

                {/* Tecnologias */}
                <div className="flex flex-wrap gap-1">
                  {rec.tecnologias.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {rec.tecnologias.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{rec.tecnologias.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Links - apenas ícones para economizar espaço */}
                <div className="flex gap-2 pt-2">
                  <a
                    href="#projetos"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver projeto
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectRecommendations;