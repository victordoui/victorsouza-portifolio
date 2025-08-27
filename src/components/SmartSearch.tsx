import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ExternalLink, Github } from 'lucide-react';
import { performSemanticSearch } from '@/utils/intelligentRecommendations';
import { supabase } from '@/integrations/supabase/client';

interface SmartSearchProps {
  onClose?: () => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: any[]; articles: any[] }>({
    projects: [],
    articles: []
  });
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, articlesResponse] = await Promise.all([
          supabase.from('projetos').select('*').order('data_criacao', { ascending: false }),
          supabase.from('artigos').select('*').order('data_publicacao', { ascending: false })
        ]);

        if (projectsResponse.data) setAllProjects(projectsResponse.data);
        if (articlesResponse.data) setAllArticles(articlesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  // Realizar busca quando query muda
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], articles: [] });
      return;
    }

    setIsLoading(true);
    const searchResults = performSemanticSearch(query, allProjects, allArticles);
    setResults(searchResults);
    setIsLoading(false);
  }, [query, allProjects, allArticles]);

  const suggestions = [
    'dashboard', 'react', 'ia', 'python', 'frontend', 'backend', 'mobile', 'ecommerce'
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Campo de busca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por projetos, tecnologias ou artigos..."
          className="pl-10 text-base h-12"
        />
      </div>

      {/* Sugestões */}
      {!query && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Sugestões populares:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Buscando...</p>
        </div>
      )}

      {/* Resultados */}
      {query && !isLoading && (
        <div className="space-y-8">
          {/* Projetos */}
          {results.projects.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Projetos ({results.projects.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.titulo}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Tecnologias */}
                        <div className="flex flex-wrap gap-1">
                          {project.tecnologias?.slice(0, 4).map((tech: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.tecnologias?.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tecnologias.length - 4}
                            </Badge>
                          )}
                        </div>

                        {/* Links */}
                        <div className="flex gap-2">
                          {project.link_demo && (
                            <a
                              href={project.link_demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Demo
                            </a>
                          )}
                          {project.link_codigo && (
                            <a
                              href={project.link_codigo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Github className="w-3 h-3" />
                              Código
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Artigos */}
          {results.articles.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Artigos ({results.articles.length})
              </h3>
              <div className="space-y-4">
                {results.articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{article.titulo}</CardTitle>
                      <CardDescription>
                        {new Date(article.data_publicacao).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {article.resumo}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Nenhum resultado */}
          {results.projects.length === 0 && results.articles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum resultado encontrado para "{query}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Tente termos como: dashboard, react, ia, python, frontend
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;