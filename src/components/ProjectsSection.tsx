import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Sparkles, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectCard } from '@/components/ProjectCard';
import ArticlesPreview from '@/components/ArticlesPreview';
interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  tecnologias: string[] | null;
  imagem_url: string | null;
  link_demo: string | null;
  link_codigo: string | null;
  data_criacao: string;
  ordem_exibicao?: number;
}
const ProjectsSection = () => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProjetos();
  }, []);
  const fetchProjetos = async () => {
    const {
      data,
      error
    } = await supabase.from('projetos').select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_criacao', { ascending: false });
    
    if (!error && data) {
      setProjetos(data);
    }
    setLoading(false);
  };
  if (loading) {
    return <section id="projects" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 mesh-background"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 bg-gradient-to-r from-primary/20 to-transparent rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-primary/10 to-transparent rounded mb-8 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <div key={i} className="h-96 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl animate-pulse"></div>)}
          </div>
        </div>
      </section>;
  }
  return <section id="projects" className="section-padding relative overflow-hidden content-visibility-auto">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 mesh-background"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 hero-gradient-text">Meus Projetos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma seleção dos meus projetos mais recentes, combinando design moderno 
            com tecnologias de ponta
          </p>
        </div>

        {/* Projects Grid */}
        {projetos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projetos.map((projeto, index) => (
              <ProjectCard 
                key={projeto.id} 
                project={projeto} 
                index={index}
              />
            ))}
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Gostou do que viu?
            </h3>
            
            <ArticlesPreview />
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Cada projeto representa uma jornada única de descoberta e inovação. 
              Vamos conversar sobre como posso ajudar a transformar suas ideias em realidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-modern px-8 py-3 group" onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({
                behavior: 'smooth'
              });
            }}>
                <span>Entre em Contato</span>
                <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 px-8 py-3" onClick={() => window.open('https://github.com/victordoui', '_blank')}>
                <Github className="mr-2 h-5 w-5" />
                Ver Mais no GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProjectsSection;