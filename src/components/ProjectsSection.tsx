import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectCard } from '@/components/ProjectCard';
import ProjectFilters from '@/components/ProjectFilters';
import AnimatedSection from '@/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    fetchProjetos();
  }, []);

  const fetchProjetos = async () => {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .order('ordem_exibicao', { ascending: false })
      .order('data_criacao', { ascending: false });

    if (!error && data) {
      setProjetos(data);
    }
    setLoading(false);
  };

  // Extract unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projetos.forEach(projeto => {
      projeto.tecnologias?.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projetos]);

  // Filter projects by selected technology
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projetos;
    return projetos.filter(projeto => 
      projeto.tecnologias?.includes(selectedTech)
    );
  }, [projetos, selectedTech]);

  if (loading) {
    return (
      <section id="projects" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 mesh-background"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 bg-gradient-to-r from-primary/20 to-transparent rounded mb-4 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-primary/10 to-transparent rounded mb-8 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-muted/30 relative overflow-hidden content-visibility-auto">
      <div className="absolute inset-0 mesh-background"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 hero-gradient-text">
            Meus Projetos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma seleção dos meus projetos mais recentes, combinando design moderno 
            com tecnologias de ponta
          </p>
        </AnimatedSection>

        {/* Technology Filters */}
        {allTechnologies.length > 0 && (
          <ProjectFilters 
            technologies={allTechnologies.slice(0, 8)}
            selectedTech={selectedTech}
            onSelectTech={setSelectedTech}
          />
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {selectedTech 
                ? `Nenhum projeto encontrado com ${selectedTech}.` 
                : 'Nenhum projeto encontrado.'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProjectCard project={projeto} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
